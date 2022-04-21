
namespace MSFSTouchPanel.TouchPanelHost.UI
{
    partial class PanelForm
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(PanelForm));
            this.webView = new Microsoft.Web.WebView2.WinForms.WebView2();
            this.buttonToggleTitleBar = new DarkUI.Controls.DarkButton();
            ((System.ComponentModel.ISupportInitialize)(this.webView)).BeginInit();
            this.SuspendLayout();
            // 
            // webView
            // 
            this.webView.CreationProperties = null;
            this.webView.DefaultBackgroundColor = System.Drawing.Color.Transparent;
            this.webView.Dock = System.Windows.Forms.DockStyle.Fill;
            this.webView.Location = new System.Drawing.Point(0, 0);
            this.webView.Name = "webView";
            this.webView.Size = new System.Drawing.Size(120, 21);
            this.webView.TabIndex = 0;
            this.webView.UseWaitCursor = true;
            this.webView.ZoomFactor = 1D;
            // 
            // buttonToggleTitleBar
            // 
            this.buttonToggleTitleBar.Location = new System.Drawing.Point(97, 3);
            this.buttonToggleTitleBar.Name = "buttonToggleTitleBar";
            this.buttonToggleTitleBar.Padding = new System.Windows.Forms.Padding(5);
            this.buttonToggleTitleBar.Size = new System.Drawing.Size(96, 22);
            this.buttonToggleTitleBar.TabIndex = 1;
            this.buttonToggleTitleBar.Text = "Toggle Titlebar";
            this.buttonToggleTitleBar.UseWaitCursor = true;
            this.buttonToggleTitleBar.Click += new System.EventHandler(this.buttonToggleTitleBar_Click);
            // 
            // PanelForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.PowderBlue;
            this.ClientSize = new System.Drawing.Size(120, 21);
            this.Controls.Add(this.buttonToggleTitleBar);
            this.Controls.Add(this.webView);
            this.DoubleBuffered = true;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.Location = new System.Drawing.Point(1000, 60);
            this.Name = "PanelForm";
            this.StartPosition = System.Windows.Forms.FormStartPosition.Manual;
            this.TransparencyKey = System.Drawing.Color.PowderBlue;
            this.UseWaitCursor = true;
            ((System.ComponentModel.ISupportInitialize)(this.webView)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        private Microsoft.Web.WebView2.WinForms.WebView2 webView;
        private DarkUI.Controls.DarkButton buttonToggleTitleBar;
    }
}