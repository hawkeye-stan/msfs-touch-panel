using Microsoft.Extensions.Hosting;
using System.Threading;
using System.Threading.Tasks;

namespace MSFSTouchPanel.TouchPanelHost
{
    public interface IWebHost : IHost
    {
        Task RestartAsync(CancellationToken cancellationToken = default);
    }
}
