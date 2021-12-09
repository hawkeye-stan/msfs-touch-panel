using System;
using System.Windows.Forms;

namespace MSFSTouchPanel.TouchPanelHost
{
    static class Program
    {
        public static StartupForm StartupForm { get; private set; }

        /// <summary>
        ///  The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            Application.SetHighDpiMode(HighDpiMode.SystemAware);
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            StartupForm = new StartupForm();
            Application.Run(StartupForm);
        }
    }
}
