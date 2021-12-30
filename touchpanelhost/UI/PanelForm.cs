using Microsoft.Web.WebView2.Core;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace MSFSTouchPanel.TouchPanelHost.UI
{
    public partial class PanelForm : Form
    {
        public PanelForm(string displayFormat, string planeId, string panelId)
        {
            InitializeComponent();

            // Keep form always on top across all active windows
            WindowManager.AlwaysOnTop(this.Handle);

            _ = InitializeAsync(displayFormat, planeId, panelId);

            this.Text = $"MSFS Touch Panel | {planeId.ToUpper()} - {panelId.ToUpper()}";
        }

        private async Task InitializeAsync(string displayFormat, string planeId, string panelId)
        {
            CoreWebView2EnvironmentOptions options = new CoreWebView2EnvironmentOptions("--disable-web-security");
            CoreWebView2Environment environment = await CoreWebView2Environment.CreateAsync(null, null, options);
            await webView.EnsureCoreWebView2Async(environment);

            var url = $"http://localhost:5000/{displayFormat.ToLower()}/{planeId.ToLower()}/{panelId.ToLower()}";
            webView.CoreWebView2.Navigate(url);
        }

        private void buttonToggleTitleBar_Click(object sender, System.EventArgs e)
        {
            if (this.FormBorderStyle == FormBorderStyle.None)
                this.FormBorderStyle = FormBorderStyle.Sizable;
            else
                this.FormBorderStyle = FormBorderStyle.None;
        }
    }
}
