using Microsoft.AspNetCore.SignalR;

namespace MeetClone.API.Hubs
{
    public class MeetingHub : Hub
    {
        public async Task GetAvailableMeetings(string user)
        {
            var message = "1234";
            await Clients.User(user).SendAsync("ReceiveGroupList", message);
        }

        public async Task JoinMeeting(string user, string meetingId)
        {
            await Groups.AddToGroupAsync(user, meetingId);

            var message = $"User {user} joined the meeting";
            await Clients.Group(meetingId).SendAsync("NewUserJoined", new { user });
            await Clients.Group(meetingId).SendAsync("ReceiveMessage", new { sender = "SYSTEM", content = message });
        }

        public async Task LeaveMeeting(string user, string meetingId)
        {
            await Groups.RemoveFromGroupAsync(user, meetingId);

            var message = $"User {user} left the meeting";
            await Clients.Group(meetingId).SendAsync("ReceiveMessage", new { sender = "SYSTEM", content = message });
        }

        public async Task SendMessageToMeeting(string user, string meetingId, string message)
        {
            await Clients.Group(meetingId).SendAsync("ReceiveMessage", new { sender = user, content = message });
        }
    }
}