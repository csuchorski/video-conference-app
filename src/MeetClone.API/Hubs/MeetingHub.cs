using Microsoft.AspNetCore.SignalR;

namespace MeetClone.API.Hubs
{
    public class MeetingHub : Hub
    {
        public async Task SendMessage(string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", message);
        }
    }
}
