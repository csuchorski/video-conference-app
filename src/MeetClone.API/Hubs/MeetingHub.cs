using Microsoft.AspNetCore.SignalR;

namespace MeetClone.API.Hubs
{
    public class MeetingHub : Hub
    {
        public async Task GetAvailableMeetings(string user)
        {
            string message = "1234";
            await Clients.User(user).SendAsync("ReceiveGroupList", message);
        }

        public async Task JoinMeeting(string user, string meetingId)
        {
            await Groups.AddToGroupAsync(user, meetingId);

            string message = $"User {user} joined the meeting";
            await Clients.Group(meetingId).SendAsync("ReceiveMessage", message);
        }

        public async Task LeaveMeeting(string user, string meetingId)
        {
            await Groups.RemoveFromGroupAsync(user, meetingId);
            
            string message = $"User {user} left the meeting";
            await Clients.Group(meetingId).SendAsync("ReceiveMessage", message);

        }
    }
}
