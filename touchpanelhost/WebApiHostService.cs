using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using MSFSTouchPanel.Shared;

namespace MSFSTouchPanel.TouchPanelHost
{
    internal class WebApiHostService : IHostedService
    {
        private readonly IHostApplicationLifetime _appLifetime;
        private readonly ISimConnectService _simConnectService;

        public WebApiHostService(IHostApplicationLifetime appLifetime, ISimConnectService simConnectService)
        {
            _appLifetime = appLifetime;
            _simConnectService = simConnectService;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _appLifetime.ApplicationStarted.Register(OnStarted);
            _appLifetime.ApplicationStopping.Register(OnStopping);
            _appLifetime.ApplicationStopped.Register(OnStopped);

            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }

        private void OnStarted()
        {
            Logger.ServerLog("API Host server started", LogLevel.INFO);
            _simConnectService.Start();
        }

        private void OnStopping()
        {
            Logger.ServerLog("API Host server stopping", LogLevel.INFO);
            _simConnectService.Stop();
        }

        private void OnStopped()
        {
            Logger.ServerLog("API Host server stopped", LogLevel.INFO);
        }
    }
}
