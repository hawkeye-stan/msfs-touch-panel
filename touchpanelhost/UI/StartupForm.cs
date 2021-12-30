using DarkUI.Controls;
using DarkUI.Forms;
using MSFSTouchPanel.Shared;
using MSFSTouchPanel.TouchPanelHost.UI;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.IO;
using System.Linq;
using System.Management.Automation;
using System.Net.NetworkInformation;
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
            GetIPAddressDisplay();

            Logger.OnServerLogged += HandleOnServerLogged;
            Logger.OnClientLogged += HandleOnClientLogged;

            StartServers();

            // Get app version label
            var version = System.Reflection.Assembly.GetExecutingAssembly().GetName().Version;
            lblVersion.Text = version.ToString();

            // Create system menus
            SetupSystemMenus();

            // Create Panels list menus
            LoadPanelsMenu();
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
            try
            {
                _syncRoot = null;

                _webHost.StopAsync();
                _webHost.Dispose();

                _webApiHost.StopAsync();
                _webApiHost.Dispose();
            }
            catch { }
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
                    AppendLogMessages(txtServerLogMessages, arg as string);
                }, e.Value);
        }

        private void HandleOnClientLogged(object sender, EventArgs<string> e)
        {
            if (_syncRoot != null)
                _syncRoot.Post((arg) =>
                {
                    AppendLogMessages(txtClientLogMessages, arg as string);
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
        
        private void systemMenuItem_Click(object sender, EventArgs e)
        {
            var itemName = ((ToolStripMenuItem)sender).Name;

            switch (itemName)
            {
                case "menuRestartServer":
                    RestartServers();
                    break;
                case "menuExit":
                    this.Close();
                    Application.Exit();
                    break;
                case "menuClearServerLog":
                    txtServerLogMessages.Clear();
                    break;
                case "menuClearClientActionLog":
                    txtClientLogMessages.Clear();
                    break;
                case "menuCreateSymbolicLinks":
                    RunPowerShellScript(@"plugin-extension\webpanel\create_symbolic_link.ps1");
                    break;
                case "menuRemoveSymbolicLinks":
                    RunPowerShellScript(@"plugin-extension\webpanel\remove_symbolic_link.ps1");
                    break;
                case "menuPatchG1000NXiMap":
                    RunPowerShellScript(@"plugin-extension\g1000nxi-map\patch.ps1");
                    break;
                case "menuUnpatchG1000NXiMap":
                    RunPowerShellScript(@"plugin-extension\g1000nxi-map\unpatch.ps1");
                    break;
            }
        }

        private void AppendLogMessages(DarkTextBox LogPanel, string message)
        {
            if (message != null)
                if (LogPanel.Text.Length == 0)
                    LogPanel.AppendText(message);
                else
                    LogPanel.AppendText(Environment.NewLine + message);
        }

        private void RunPowerShellScript(string scriptPath)
        {
            var execPath = AppContext.BaseDirectory;
            var fullScriptPath = execPath + scriptPath;
            var scriptContents = File.ReadAllText(fullScriptPath);

            // create a new hosted PowerShell instance using the default runspace.
            using (PowerShell ps = PowerShell.Create())
            {
                // specify the script code to run.
                ps.AddScript(scriptContents);
                ps.AddArgument("'" + execPath + "'");

                // execute the script as administrator if lauched as admin
                var pipelineObjects = ps.Invoke("Set-ExecutionPolicy Unrestricted");

                foreach (var item in pipelineObjects)
                {
                    AppendLogMessages(txtServerLogMessages, item.BaseObject.ToString());
                }

                foreach (var error in ps.Streams.Error)
                {
                    AppendLogMessages(txtServerLogMessages, error.ToString());
                }
            }
        }

        private void GetIPAddressDisplay()
        {
            foreach (NetworkInterface ni in NetworkInterface.GetAllNetworkInterfaces())
            {
                var addr = ni.GetIPProperties().GatewayAddresses.FirstOrDefault();
                if (addr != null)
                {
                    if (ni.NetworkInterfaceType == NetworkInterfaceType.Wireless80211 || ni.NetworkInterfaceType == NetworkInterfaceType.Ethernet)
                    {
                        foreach (UnicastIPAddressInformation ip in ni.GetIPProperties().UnicastAddresses)
                        {
                            if (ip.Address.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
                            {
                                txtServerIP.Text = $"http://{ip.Address}:5000";
                            }
                        }
                    }
                }
            }
        }

        private void SetupSystemMenus()
        {
            menuRestartServer.Click += systemMenuItem_Click;
            menuExit.Click += systemMenuItem_Click;

            menuClearClientActionLog.Click += systemMenuItem_Click;
            menuClearServerLog.Click += systemMenuItem_Click;

            menuCreateSymbolicLinks.Click += systemMenuItem_Click;
            menuRemoveSymbolicLinks.Click += systemMenuItem_Click;
            menuPatchG1000NXiMap.Click += systemMenuItem_Click;
            menuUnpatchG1000NXiMap.Click += systemMenuItem_Click;
        }

        private void LoadPanelsMenu()
        {
            JObject panelInfo;

            try
            {
                using (StreamReader file = File.OpenText(Path.Combine(AppContext.BaseDirectory, @"Data\PlanePanelProfileInfo.json")))
                using (JsonTextReader reader = new JsonTextReader(file))
                {
                    panelInfo = (JObject)JToken.ReadFrom(reader);
                }

                foreach (JObject plane in panelInfo["planes"])
                {
                    var planeMenu = new ToolStripMenuItem();
                    planeMenu.Name = $"{plane["planeId"]}";
                    planeMenu.Text = $"{plane["name"]}";
                    planeMenu.BackColor = menuPanelRoot.BackColor;

                    foreach (JObject panel in plane["panels"])
                    {
                        var panelMenu = new ToolStripMenuItem();
                        panelMenu.Name = $"menu_{panel["type"]}_{plane["planeId"]}_{panel["panelId"]}";
                        panelMenu.Click += panelMenuItem_Clicked;
                        panelMenu.Text = $"{panel["name"]}";
                        panelMenu.BackColor = menuPanelRoot.BackColor;
                        planeMenu.DropDownItems.Add(panelMenu);
                    }

                    menuPanelRoot.DropDownItems.Add(planeMenu);
                }
            }
            catch 
            {
                AppendLogMessages(txtServerLogMessages, "ERROR: PlanePanelProfileInfo.json file is not found or is invalid.");
            }
        }

        private void panelMenuItem_Clicked(object sender, EventArgs e)
        {
            var itemName = ((ToolStripMenuItem)sender).Name;

            var splits = itemName.Split('_');

            var format = splits[1];
            var planeType = splits[2];
            var panel = splits[3];

            for (var i = 4; i < splits.Length; i++)
                panel = String.Join('_', new String[] { panel, splits[i] });

            var panelForm = new PanelForm(format, planeType, panel);
            panelForm.Show();
        }
    }
}
