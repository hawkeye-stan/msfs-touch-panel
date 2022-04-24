using System.Collections.Generic;

namespace MSFSTouchPanel.Shared
{
    public class PlaneProfileInfo
    {
        public int Id { get; set; }

        public string PlaneId { get; set; }

        public string Name { get; set; }

        public List<PanelInfo> Panels { get; set; }
    }

    public class PanelInfo
    {
        public int Id { get; set; }

        public string PanelId { get; set; }

        public string Name { get; set; }

        public string Type { get; set; }

        public int Width { get; set; }

        public int Height { get; set; }

        public string PanelRatio { get; set; }

        public string IframeRatio { get; set; }

        public string Definitions { get; set; }
    }
}
