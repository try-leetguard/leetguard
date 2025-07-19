(function() {
    const originalFetch = window.fetch;
  
    window.fetch = async function(...args) {
      const [url, options] = args;
      
      // Check for submission-related endpoints
      if (typeof url === "string") {
        // Handle submission POST request
        if (url.includes("/submit/")) {
          let requestBody = null;
          try {
            requestBody = options && options.body ? JSON.parse(options.body) : {};
          } catch (e) {
            // Could not parse submission body
          }
  
          // Call original fetch
          const response = await originalFetch.apply(this, args);
  
          try {
            const clone = response.clone();
            const json = await clone.json();
  
            // Send data back to content script
            window.postMessage({
              source: "leetguard-injected",
              type: "submission",
              url,
              requestBody,
              responseData: json
            }, "*");
          } catch(e) {
            // Could not parse submission response JSON
          }
  
          return response;
        }
        
        // Handle submission status check
        if (url.includes("/check/")) {
          console.log("🔍 Status check intercepted:", url);
          
          // Call original fetch
          const response = await originalFetch.apply(this, args);
  
          try {
            const clone = response.clone();
            const json = await clone.json();
            console.log("📊 Status response:", json.status_code, json.status_msg);
  
            // Send data back to content script
            window.postMessage({
              source: "leetguard-injected",
              type: "status_check",
              url,
              responseData: json
            }, "*");
          } catch(e) {
            // Could not parse status response JSON
          }
  
          return response;
        }
      }
  
      // If not submission-related, just do normal fetch
      return originalFetch.apply(this, args);
    };
  })();