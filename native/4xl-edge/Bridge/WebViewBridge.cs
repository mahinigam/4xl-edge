using System;
using System.Diagnostics;
using System.Text.Json;
using Microsoft.Web.WebView2.Core;

namespace _4xl_edge.Bridge
{
    public class WebViewBridge
    {
        private CoreWebView2 _webView;
        private Inference.InferenceEngine _inferenceEngine;

        public WebViewBridge(CoreWebView2 webView)
        {
            _webView = webView;
            _inferenceEngine = new Inference.InferenceEngine();
        }

        public async void OnWebMessageReceived(CoreWebView2 sender, CoreWebView2WebMessageReceivedEventArgs args)
        {
            var message = args.TryGetWebMessageAsString();
            var payload = JsonDocument.Parse(message).RootElement;
            var type = payload.GetProperty("type").GetString();

            if (type == "getCapabilities")
            {
                var caps = _inferenceEngine.DetectCapabilities();
                var response = new
                {
                    type = "capabilitiesResult",
                    capabilities = caps
                };
                _webView.PostWebMessageAsJson(JsonSerializer.Serialize(response));
            }
            else if (type == "infer")
            {
                var modelName = payload.GetProperty("modelName").GetString();
                var imageBase64 = payload.GetProperty("image").GetString();
                
                // Fire progress update
                _webView.PostWebMessageAsJson(JsonSerializer.Serialize(new {
                    type = "inferenceProgress",
                    progress = new { stage = "processing", message = "Native inference starting..." }
                }));

                var result = await _inferenceEngine.RunInferenceAsync(modelName, imageBase64);
                
                _webView.PostWebMessageAsJson(JsonSerializer.Serialize(new {
                    type = "inferenceResult",
                    image = result.Image,
                    provider = result.Provider,
                    accelerator = result.Accelerator,
                    latencyMs = result.LatencyMs,
                    inferenceMs = result.InferenceMs
                }));
            }
        }
    }
}
