using DarkUI.Forms;
using MSFSTouchPanel.Shared;
using MSFSTouchPanel.TouchPanelHost.UI;
using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Windows.Forms;

namespace MSFSTouchPanel.TouchPanelHost
{
    public partial class StartupForm : DarkForm
    {
        private SynchronizationContext _syncRoot;
        private IWebHost _webHost;
        private IWebHost _webApiHost;

        public StartupForm()
        {
            InitializeComponent();

            _syncRoot = SynchronizationContext.Current;

            // Get server host IP
            var hostName = Dns.GetHostName();
            var hostIp = Dns.GetHostEntry(hostName).AddressList.First(addr => addr.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork);
            txtServerIP.Text = $"http://{Convert.ToString(hostIp)}:5000";

            Logger.OnServerLogged += HandleOnServerLogged;
            Logger.OnClientLogged += HandleOnClientLogged;

            StartServers();

            var version = System.Reflection.Assembly.GetExecutingAssembly().GetName().Version;
            lblVersion.Text = version.ToString();

            // setup menu events
            menuRestartServer.Click += menuItem_Clicked;
            menuClearClientActionLog.Click += menuItem_Clicked;
            menuClearServerLog.Click += menuItem_Clicked;

            menu_buttonpanel_g1000nxi_pfd.Click += experimentalMenuItem_Clicked;
            menu_buttonpanel_g1000nxi_mfd.Click += experimentalMenuItem_Clicked;
            menu_buttonpanel_fbwa32nx_cdu.Click += experimentalMenuItem_Clicked;

            menu_framepanel_g1000nxi_pfd.Click += experimentalMenuItem_Clicked;
            menu_framepanel_g1000nxi_mfd.Click += experimentalMenuItem_Clicked;
            menu_framepanel_fbwa32nx_cdu.Click += experimentalMenuItem_Clicked;

            menu_webpanel_g1000nxi_mfd.Click += experimentalMenuItem_Clicked;
            menu_webpanel_g1000nxi_pfd.Click += experimentalMenuItem_Clicked;
            menu_webpanel_cj4_pfd.Click += experimentalMenuItem_Clicked;
            menu_webpanel_cj4_mfd.Click += experimentalMenuItem_Clicked;
            menu_webpanel_cj4_fmc.Click += experimentalMenuItem_Clicked;
            menu_webpanel_cj4_sai.Click += experimentalMenuItem_Clicked;
            menu_webpanel_fbwa32nx_cdu.Click += experimentalMenuItem_Clicked;
            menu_webpanel_fbwa32nx_dcdu.Click += experimentalMenuItem_Clicked;
            menu_webpanel_fbwa32nx_eicas_1.Click += experimentalMenuItem_Clicked;
            menu_webpanel_fbwa32nx_eicas_2.Click += experimentalMenuItem_Clicked;
            menu_webpanel_fbwa32nx_fcu.Click += experimentalMenuItem_Clicked;
            menu_webpanel_fbwa32nx_isis.Click += experimentalMenuItem_Clicked;
            menu_webpanel_fbwa32nx_nd_template_1.Click += experimentalMenuItem_Clicked;
            menu_webpanel_fbwa32nx_pfd_template_1.Click += experimentalMenuItem_Clicked;
            menu_webpanel_fbwa32nx_rmp.Click += experimentalMenuItem_Clicked;
        }

        public string HostIP
        {
            set
            {
                _syncRoot.Post((arg) =>
                {
                    var ip = arg as string;
                    if (ip != null)
                        txtServerIP.Text = ip;
                }, value);
            }
        }

        private void StartServers()
        {
            _webHost = new WebHost(this.Handle);
            _webHost.StartAsync();

            _webApiHost = new WebApiHost(this.Handle);
            _webApiHost.StartAsync();
        }

        private void StopServers()
        {
            _syncRoot = null;

            _webHost.StopAsync();
            _webHost.Dispose();

            _webApiHost.StopAsync();
            _webApiHost.Dispose();
        }

        private void RestartServers()
        {
            _webHost.RestartAsync();
            _webApiHost.RestartAsync();
        }

        private void HandleOnServerLogged(object sender, EventArgs<string> e)
        {
            if (_syncRoot != null)
                _syncRoot.Post((arg) =>
                {
                    var logMessages = arg as string;

                    if (logMessages != null)
                        if (txtServerLogMessages.Text.Length == 0)
                            txtServerLogMessages.AppendText(logMessages);
                        else
                            txtServerLogMessages.AppendText(Environment.NewLine + logMessages);
                }, e.Value);
        }

        private void HandleOnClientLogged(object sender, EventArgs<string> e)
        {
            if (_syncRoot != null)
                _syncRoot.Post((arg) =>
                {
                    var logMessages = arg as string;
                    if (logMessages != null)
                        if (txtClientLogMessages.Text.Length == 0)
                            txtClientLogMessages.AppendText(logMessages);
                        else
                            txtClientLogMessages.AppendText(Environment.NewLine + logMessages);
                }, e.Value);
        }

        private void StartupForm_Load(object sender, EventArgs e)
        {
            notifyIcon1.BalloonTipText = "Application Minimized";
            notifyIcon1.BalloonTipTitle = "MSFS Touch Panel Server";
        }

        private void StartupForm_FormClosing(object sender, FormClosingEventArgs e)
        {
            StopServers();
        }

        private void StartupForm_Resize(object sender, EventArgs e)
        {

            if (this.WindowState == FormWindowState.Minimized)
            {
                if (checkBoxMinimizeToTray.Checked)
                {
                    ShowInTaskbar = false;
                    notifyIcon1.Visible = true;
                    notifyIcon1.ShowBalloonTip(1000);
                }
            }
        }
        private void notifyIcon1_MouseDoubleClick(object sender, MouseEventArgs e)
        {
            ShowInTaskbar = true;
            notifyIcon1.Visible = false;
            WindowState = FormWindowState.Normal;
        }

        private void notifyIcon1_DoubleClick(object sender, EventArgs e)
        {
            ShowInTaskbar = true;
            notifyIcon1.Visible = false;
            WindowState = FormWindowState.Normal;
        }

        private void menuItem_Clicked(object sender, EventArgs e)
        {
            var itemName = ((ToolStripMenuItem)sender).Name;

            switch (itemName)
            {
                case "menuRestartServer":
                    RestartServers();
                    break;
                case "menuClearServerLog":
                    txtServerLogMessages.Clear();
                    break;
                case "menuClearClientActionLog":
                    txtClientLogMessages.Clear();
                    break;
            }
        }

        private void experimentalMenuItem_Clicked(object sender, EventArgs e)
        {
            var itemName = ((ToolStripMenuItem)sender).Name;

            var splits = itemName.Split('_');

            var format = splits[1];
            var planeType = splits[2];
            var panel = splits[3];

            for(var i = 4; i < splits.Length; i++)
                panel = String.Join('_', new String[] { panel, splits[i] });


            var panelForm = new PanelForm(format, planeType, panel);
            panelForm.Show();
        }
    }
}
