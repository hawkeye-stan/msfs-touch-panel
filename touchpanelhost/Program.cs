
using System;
using System.Diagnostics;
using System.Threading;
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
            bool createNew;

            using var mutex = new Mutex(true, typeof(Program).Namespace, out createNew);

            if (createNew)
            {
                Application.SetHighDpiMode(HighDpiMode.SystemAware);
                Application.EnableVisualStyles();
                Application.SetCompatibleTextRenderingDefault(false);

                StartupForm = new StartupForm();
                Application.Run(StartupForm);
            }
            else
            {
                var current = Process.GetCurrentProcess();

                foreach (var process in Process.GetProcessesByName(current.ProcessName))
                {
                    if (process.Id == current.Id) continue;
                    PInvoke.SetForegroundWindow(process.MainWindowHandle);
                    break;
                }
            }
        }
    }
}
