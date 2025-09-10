export async function generateImage(
  prompt: string,
  width: number = 1024,
  height: number = 1024,
  steps: number = 50,
  cfg_scale: number = 3.5,
  seed: number = 0
): Promise<{ imageUrl: string; prompt: string; seed: number }> {
  try {
    const invokeUrl = "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-dev";
    
    const payload = {
      prompt,
      mode: "base",
      cfg_scale,
      width,
      height,
      seed,
      steps
    };

    const response = await fetch(invokeUrl, {
      method: 'POST',
      headers: {
        "Authorization": "Bearer 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",
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseBody = await response.json();
    
    // Debug: Log the actual response structure
    console.log("NVIDIA API Response:", JSON.stringify(responseBody, null, 2));
    
    // NVIDIA API returns the image in artifacts array with base64 field
    let imageUrl = null;
    
    // Handle NVIDIA's artifacts response format
    if (responseBody.artifacts && responseBody.artifacts.length > 0) {
      imageUrl = responseBody.artifacts[0].base64;
    } else if (responseBody.image) {
      imageUrl = responseBody.image;
    } else if (responseBody.data && responseBody.data.length > 0) {
      imageUrl = responseBody.data[0].b64_json || responseBody.data[0].url || responseBody.data[0].image;
    } else if (responseBody.b64_json) {
      imageUrl = responseBody.b64_json;
    } else if (responseBody.url) {
      imageUrl = responseBody.url;
    }
    
    // If we have base64 data, convert it to data URL
    if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
      imageUrl = `data:image/png;base64,${imageUrl}`;
    }
    
    if (!imageUrl) {
      console.error("No image found in response. Available keys:", Object.keys(responseBody));
      throw new Error("No image URL returned from NVIDIA API");
    }

    return {
      imageUrl,
      prompt,
      seed
    };
  } catch (error) {
    console.error("NVIDIA Image Generation API error:", error);
    throw new Error("Failed to generate image. Please check your API configuration and try again.");
  }
}