
namespace MSFSTouchPanel.TouchPanelHost
{
    partial class StartupForm
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
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(StartupForm));
            this.notifyIcon1 = new System.Windows.Forms.NotifyIcon(this.components);
            this.checkBoxMinimizeToTray = new DarkUI.Controls.DarkCheckBox();
            this.darkLabel1 = new DarkUI.Controls.DarkLabel();
            this.lblVersion = new DarkUI.Controls.DarkLabel();
            this.darkLabel2 = new DarkUI.Controls.DarkLabel();
            this.darkLabel3 = new DarkUI.Controls.DarkLabel();
            this.darkLabel4 = new DarkUI.Controls.DarkLabel();
            this.darkMenuStrip1 = new DarkUI.Controls.DarkMenuStrip();
            this.menuServer = new System.Windows.Forms.ToolStripMenuItem();
            this.menuRestartServer = new System.Windows.Forms.ToolStripMenuItem();
            this.menuExit = new System.Windows.Forms.ToolStripMenuItem();
            this.menuLog = new System.Windows.Forms.ToolStripMenuItem();
            this.menuClearClientActionLog = new System.Windows.Forms.ToolStripMenuItem();
            this.menuClearServerLog = new System.Windows.Forms.ToolStripMenuItem();
            this.menuPanelRoot = new System.Windows.Forms.ToolStripMenuItem();
            this.menuAdvanced = new System.Windows.Forms.ToolStripMenuItem();
            this.menuCreateSymbolicLinks = new System.Windows.Forms.ToolStripMenuItem();
            this.menuRemoveSymbolicLinks = new System.Windows.Forms.ToolStripMenuItem();
            this.menuPatchG1000NXiMap = new System.Windows.Forms.ToolStripMenuItem();
            this.menuUnpatchG1000NXiMap = new System.Windows.Forms.ToolStripMenuItem();
            this.txtServerIP = new DarkUI.Controls.DarkTextBox();
            this.txtClientLogMessages = new DarkUI.Controls.DarkTextBox();
            this.txtServerLogMessages = new DarkUI.Controls.DarkTextBox();
            this.darkMenuStrip1.SuspendLayout();
            this.SuspendLayout();
            // 
            // notifyIcon1
            // 
            this.notifyIcon1.Icon = ((System.Drawing.Icon)(resources.GetObject("notifyIcon1.Icon")));
            this.notifyIcon1.Text = "notifyIcon1";
            this.notifyIcon1.Visible = true;
            this.notifyIcon1.DoubleClick += new System.EventHandler(this.notifyIcon1_DoubleClick);
            // 
            // checkBoxMinimizeToTray
            // 
            this.checkBoxMinimizeToTray.AutoSize = true;
            this.checkBoxMinimizeToTray.Font = new System.Drawing.Font("Segoe UI", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
            this.checkBoxMinimizeToTray.Location = new System.Drawing.Point(26, 519);
            this.checkBoxMinimizeToTray.Name = "checkBoxMinimizeToTray";
            this.checkBoxMinimizeToTray.Size = new System.Drawing.Size(189, 24);
            this.checkBoxMinimizeToTray.TabIndex = 11;
            this.checkBoxMinimizeToTray.Text = "Minimize to System Tray";
            // 
            // darkLabel1
            // 
            this.darkLabel1.AutoSize = true;
            this.darkLabel1.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(220)))), ((int)(((byte)(220)))), ((int)(((byte)(220)))));
            this.darkLabel1.Location = new System.Drawing.Point(533, 533);
            this.darkLabel1.Name = "darkLabel1";
            this.darkLabel1.Size = new System.Drawing.Size(45, 15);
            this.darkLabel1.TabIndex = 12;
            this.darkLabel1.Text = "Version";
            // 
            // lblVersion
            // 
            this.lblVersion.AutoSize = true;
            this.lblVersion.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(220)))), ((int)(((byte)(220)))), ((int)(((byte)(220)))));
            this.lblVersion.Location = new System.Drawing.Point(584, 533);
            this.lblVersion.Name = "lblVersion";
            this.lblVersion.Size = new System.Drawing.Size(45, 15);
            this.lblVersion.TabIndex = 13;
            this.lblVersion.Text = "version";
            // 
            // darkLabel2
            // 
            this.darkLabel2.AutoSize = true;
            this.darkLabel2.Font = new System.Drawing.Font("Segoe UI", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
            this.darkLabel2.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(220)))), ((int)(((byte)(220)))), ((int)(((byte)(220)))));
            this.darkLabel2.Location = new System.Drawing.Point(25, 40);
            this.darkLabel2.Name = "darkLabel2";
            this.darkLabel2.Size = new System.Drawing.Size(80, 20);
            this.darkLabel2.TabIndex = 14;
            this.darkLabel2.Text = "Server URL";
            // 
            // darkLabel3
            // 
            this.darkLabel3.AutoSize = true;
            this.darkLabel3.Font = new System.Drawing.Font("Segoe UI", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
            this.darkLabel3.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(220)))), ((int)(((byte)(220)))), ((int)(((byte)(220)))));
            this.darkLabel3.Location = new System.Drawing.Point(26, 72);
            this.darkLabel3.Name = "darkLabel3";
            this.darkLabel3.Size = new System.Drawing.Size(123, 20);
            this.darkLabel3.TabIndex = 15;
            this.darkLabel3.Text = "Client Action Log";
            // 
            // darkLabel4
            // 
            this.darkLabel4.AutoSize = true;
            this.darkLabel4.Font = new System.Drawing.Font("Segoe UI", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
            this.darkLabel4.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(220)))), ((int)(((byte)(220)))), ((int)(((byte)(220)))));
            this.darkLabel4.Location = new System.Drawing.Point(26, 294);
            this.darkLabel4.Name = "darkLabel4";
            this.darkLabel4.Size = new System.Drawing.Size(79, 20);
            this.darkLabel4.TabIndex = 16;
            this.darkLabel4.Text = "Server Log";
            // 
            // darkMenuStrip1
            // 
            this.darkMenuStrip1.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(60)))), ((int)(((byte)(63)))), ((int)(((byte)(65)))));
            this.darkMenuStrip1.Font = new System.Drawing.Font("Segoe UI", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
            this.darkMenuStrip1.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(220)))), ((int)(((byte)(220)))), ((int)(((byte)(220)))));
            this.darkMenuStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.menuServer,
            this.menuLog,
            this.menuPanelRoot,
            this.menuAdvanced});
            this.darkMenuStrip1.Location = new System.Drawing.Point(0, 0);
            this.darkMenuStrip1.Name = "darkMenuStrip1";
            this.darkMenuStrip1.Padding = new System.Windows.Forms.Padding(3, 2, 0, 2);
            this.darkMenuStrip1.Size = new System.Drawing.Size(1147, 28);
            this.darkMenuStrip1.TabIndex = 17;
            this.darkMenuStrip1.Text = "darkMenuStrip1";
            // 
            // menuServer
            // 
            this.menuServer.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(60)))), ((int)(((byte)(63)))), ((int)(((byte)(65)))));
            this.menuServer.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.menuRestartServer,
            this.menuExit});
            this.menuServer.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(220)))), ((int)(((byte)(220)))), ((int)(((byte)(220)))));
            this.menuServer.Name = "menuServer";
            this.menuServer.Size = new System.Drawing.Size(62, 24);
            this.menuServer.Text = "Server";
            // 
            // menuRestartServer
            // 
            this.menuRestartServer.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(60)))), ((int)(((byte)(63)))), ((int)(((byte)(65)))));
            this.menuRestartServer.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(220)))), ((int)(((byte)(220)))), ((int)(((byte)(220)))));
            this.menuRestartServer.Name = "menuRestartServer";
            this.menuRestartServer.Size = new System.Drawing.Size(169, 24);
            this.menuRestartServer.Text = "Restart Server";
            // 
            // menuExit
            // 
            this.menuExit.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(60)))), ((int)(((byte)(63)))), ((int)(((byte)(65)))));
            this.menuExit.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(220)))), ((int)(((byte)(220)))), ((int)(((byte)(220)))));
            this.menuExit.Name = "menuExit";
            this.menuExit.Size = new System.Drawing.Size(169, 24);
            this.menuExit.Text = "Exit";
            // 
            // menuLog
            // 
            this.menuLog.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(60)))), ((int)(((byte)(63)))), ((int)(((byte)(65)))));
            this.menuLog.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.menuClearClientActionLog,
            this.menuClearServerLog});
            this.menuLog.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(220)))), ((int)(((byte)(220)))), ((int)(((byte)(220)))));
            this.menuLog.Name = "menuLog";
            this.menuLog.Size = new System.Drawing.Size(46, 24);
            this.menuLog.Text = "Log";
            // 
            // menuClearClientActionLog
            // 
            this.menuClearClientActionLog.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(60)))), ((int)(((byte)(63)))), ((int)(((byte)(65)))));
            this.menuClearClientActionLog.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(220)))), ((int)(((byte)(220)))), ((int)(((byte)(220)))));
            this.menuClearClientActionLog.Name = "menuClearClientActionLog";
            this.menuClearClientActionLog.Size = new System.Drawing.Size(230, 24);
            this.menuClearClientActionLog.Text = "Clear Client Action Log";
            // 
            // menuClearServerLog
            // 
            this.menuClearServerLog.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(60)))), ((int)(((byte)(63)))), ((int)(((byte)(65)))));
            this.menuClearServerLog.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(220)))), ((int)(((byte)(220)))), ((int)(((byte)(220)))));
            this.menuClearServerLog.Name = "menuClearServerLog";
            this.menuClearServerLog.Size = new System.Drawing.Size(230, 24);
            this.menuClearServerLog.Text = "Clear Server Log";
            // 
            // menuPanelRoot
            // 
            this.menuPanelRoot.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(60)))), ((int)(((byte)(63)))), ((int)(((byte)(65)))));
            this.menuPanelRoot.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(220)))), ((int)(((byte)(220)))), ((int)(((byte)(220)))));
            this.menuPanelRoot.Name = "menuPanelRoot";
            this.menuPanelRoot.Size = new System.Drawing.Size(62, 24);
            this.menuPanelRoot.Text = "Panels";
            // 
            // menuAdvanced
            // 
            this.menuAdvanced.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(60)))), ((int)(((byte)(63)))), ((int)(((byte)(65)))));
            this.menuAdvanced.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.menuCreateSymbolicLinks,
            this.menuRemoveSymbolicLinks,
            this.menuPatchG1000NXiMap,
            this.menuUnpatchG1000NXiMap});
            this.menuAdvanced.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(220)))), ((int)(((byte)(220)))), ((int)(((byte)(220)))));
            this.menuAdvanced.Name = "menuAdvanced";
            this.menuAdvanced.Size = new System.Drawing.Size(87, 24);
            this.menuAdvanced.Text = "Advanced";
            // 
            // menuCreateSymbolicLinks
            // 
            this.menuCreateSymbolicLinks.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(60)))), ((int)(((byte)(63)))), ((int)(((byte)(65)))));
            this.menuCreateSymbolicLinks.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(220)))), ((int)(((byte)(220)))), ((int)(((byte)(220)))));
            this.menuCreateSymbolicLinks.Name = "menuCreateSymbolicLinks";
            this.menuCreateSymbolicLinks.Size = new System.Drawing.Size(418, 24);
            this.menuCreateSymbolicLinks.Text = "Create HTML assets folders (run as administrator)";
            // 
            // menuRemoveSymbolicLinks
            // 
            this.menuRemoveSymbolicLinks.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(60)))), ((int)(((byte)(63)))), ((int)(((byte)(65)))));
            this.menuRemoveSymbolicLinks.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(220)))), ((int)(((byte)(220)))), ((int)(((byte)(220)))));
            this.menuRemoveSymbolicLinks.Name = "menuRemoveSymbolicLinks";
            this.menuRemoveSymbolicLinks.Size = new System.Drawing.Size(418, 24);
            this.menuRemoveSymbolicLinks.Text = "Remove HTML assets folders  (run as administrator)";
            // 
            // menuPatchG1000NXiMap
            // 
            this.menuPatchG1000NXiMap.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(60)))), ((int)(((byte)(63)))), ((int)(((byte)(65)))));
            this.menuPatchG1000NXiMap.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(220)))), ((int)(((byte)(220)))), ((int)(((byte)(220)))));
            this.menuPatchG1000NXiMap.Name = "menuPatchG1000NXiMap";
            this.menuPatchG1000NXiMap.Size = new System.Drawing.Size(418, 24);
            this.menuPatchG1000NXiMap.Text = "Patch G1000NXi map feature";
            // 
            // menuUnpatchG1000NXiMap
            // 
            this.menuUnpatchG1000NXiMap.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(60)))), ((int)(((byte)(63)))), ((int)(((byte)(65)))));
            this.menuUnpatchG1000NXiMap.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(220)))), ((int)(((byte)(220)))), ((int)(((byte)(220)))));
            this.menuUnpatchG1000NXiMap.Name = "menuUnpatchG1000NXiMap";
            this.menuUnpatchG1000NXiMap.Size = new System.Drawing.Size(418, 24);
            this.menuUnpatchG1000NXiMap.Text = "Unpatch G1000NXi map feature";
            // 
            // txtServerIP
            // 
            this.txtServerIP.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(69)))), ((int)(((byte)(73)))), ((int)(((byte)(74)))));
            this.txtServerIP.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.txtServerIP.Font = new System.Drawing.Font("Segoe UI", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
            this.txtServerIP.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(220)))), ((int)(((byte)(220)))), ((int)(((byte)(220)))));
            this.txtServerIP.Location = new System.Drawing.Point(115, 38);
            this.txtServerIP.Name = "txtServerIP";
            this.txtServerIP.ReadOnly = true;
            this.txtServerIP.Size = new System.Drawing.Size(336, 27);
            this.txtServerIP.TabIndex = 18;
            // 
            // txtClientLogMessages
            // 
            this.txtClientLogMessages.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(69)))), ((int)(((byte)(73)))), ((int)(((byte)(74)))));
            this.txtClientLogMessages.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.txtClientLogMessages.Font = new System.Drawing.Font("Consolas", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
            this.txtClientLogMessages.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(220)))), ((int)(((byte)(220)))), ((int)(((byte)(220)))));
            this.txtClientLogMessages.Location = new System.Drawing.Point(26, 95);
            this.txtClientLogMessages.Multiline = true;
            this.txtClientLogMessages.Name = "txtClientLogMessages";
            this.txtClientLogMessages.ReadOnly = true;
            this.txtClientLogMessages.Size = new System.Drawing.Size(1091, 180);
            this.txtClientLogMessages.TabIndex = 19;
            // 
            // txtServerLogMessages
            // 
            this.txtServerLogMessages.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(69)))), ((int)(((byte)(73)))), ((int)(((byte)(74)))));
            this.txtServerLogMessages.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.txtServerLogMessages.Font = new System.Drawing.Font("Consolas", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
            this.txtServerLogMessages.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(220)))), ((int)(((byte)(220)))), ((int)(((byte)(220)))));
            this.txtServerLogMessages.Location = new System.Drawing.Point(26, 317);
            this.txtServerLogMessages.Multiline = true;
            this.txtServerLogMessages.Name = "txtServerLogMessages";
            this.txtServerLogMessages.ReadOnly = true;
            this.txtServerLogMessages.Size = new System.Drawing.Size(1091, 180);
            this.txtServerLogMessages.TabIndex = 20;
            // 
            // StartupForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1147, 555);
            this.Controls.Add(this.txtServerLogMessages);
            this.Controls.Add(this.txtClientLogMessages);
            this.Controls.Add(this.txtServerIP);
            this.Controls.Add(this.darkLabel4);
            this.Controls.Add(this.darkLabel3);
            this.Controls.Add(this.darkLabel2);
            this.Controls.Add(this.lblVersion);
            this.Controls.Add(this.darkLabel1);
            this.Controls.Add(this.checkBoxMinimizeToTray);
            this.Controls.Add(this.darkMenuStrip1);
            this.DoubleBuffered = true;
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MainMenuStrip = this.darkMenuStrip1;
            this.MaximizeBox = false;
            this.Name = "StartupForm";
            this.Text = "MSFS Touch Panel Server";
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.StartupForm_FormClosing);
            this.Load += new System.EventHandler(this.StartupForm_Load);
            this.Resize += new System.EventHandler(this.StartupForm_Resize);
            this.darkMenuStrip1.ResumeLayout(false);
            this.darkMenuStrip1.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion
        private System.Windows.Forms.NotifyIcon notifyIcon1;
        private DarkUI.Controls.DarkCheckBox checkBoxMinimizeToTray;
        private DarkUI.Controls.DarkLabel darkLabel1;
        private DarkUI.Controls.DarkLabel lblVersion;
        private DarkUI.Controls.DarkLabel darkLabel2;
        private DarkUI.Controls.DarkLabel darkLabel3;
        private DarkUI.Controls.DarkLabel darkLabel4;
        private DarkUI.Controls.DarkMenuStrip darkMenuStrip1;
        private System.Windows.Forms.ToolStripMenuItem menuServer;
        private System.Windows.Forms.ToolStripMenuItem menuLog;
        private System.Windows.Forms.ToolStripMenuItem menuPanelRoot;
        private System.Windows.Forms.ToolStripMenuItem menuRestartServer;
        private System.Windows.Forms.ToolStripMenuItem menuClearClientActionLog;
        private System.Windows.Forms.ToolStripMenuItem menuClearServerLog;
        private DarkUI.Controls.DarkTextBox txtServerIP;
        private DarkUI.Controls.DarkTextBox txtClientLogMessages;
        private DarkUI.Controls.DarkTextBox txtServerLogMessages;
        private System.Windows.Forms.ToolStripMenuItem menuExit;
        private System.Windows.Forms.ToolStripMenuItem menuAdvanced;
        private System.Windows.Forms.ToolStripMenuItem menuCreateSymbolicLinks;
        private System.Windows.Forms.ToolStripMenuItem menuRemoveSymbolicLinks;
        private System.Windows.Forms.ToolStripMenuItem menuPatchG1000NXiMap;
        private System.Windows.Forms.ToolStripMenuItem menuUnpatchG1000NXiMap;
    }
}