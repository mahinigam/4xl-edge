using Microsoft.UI.Xaml;
using Microsoft.Web.WebView2.Core;
using System;
using System.Text.Json;

namespace _4xl_edge
{
    public sealed partial class MainWindow : Window
    {
        private Bridge.WebViewBridge _bridge;

        public MainWindow()
        {
            this.InitializeComponent();
            this.ExtendsContentIntoTitleBar = true;
            InitializeAsync();
        }

        private async void InitializeAsync()
        {
            await UIWebView.EnsureCoreWebView2Async();
            _bridge = new Bridge.WebViewBridge(UIWebView.CoreWebView2);
            UIWebView.CoreWebView2.WebMessageReceived += _bridge.OnWebMessageReceived;
        }
    }
}
