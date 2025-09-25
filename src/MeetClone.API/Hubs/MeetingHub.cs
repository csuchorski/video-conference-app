using System.Diagnostics;
using MeetClone.API.Dtos;
using Microsoft.AspNetCore.SignalR;

namespace MeetClone.API.Hubs
{
    public class MeetingHub : Hub
    {
        private readonly ILogger<MeetingHub> _logger;

        public MeetingHub(ILogger<MeetingHub> logger)
        {
            _logger = logger;
            _logger.LogInformation($"Created hub");
        }

        public async Task JoinMeeting(string user, string meetingId)
        {
            await Groups.AddToGroupAsync(user, meetingId);

            var message = $"User {user} joined the meeting";
            await Clients.GroupExcept(meetingId, user).SendAsync("NewUserJoined", user);
            await Clients.Group(meetingId).SendAsync("ReceiveMessage", new { sender = "SYSTEM", content = message });
        }

        public async Task LeaveMeeting(string user, string meetingId)
        {
            await Groups.RemoveFromGroupAsync(user, meetingId);

            var message = $"User {user} left the meeting";
            await Clients.Group(meetingId).SendAsync("UserLeft", user);
            await Clients.Group(meetingId).SendAsync("ReceiveMessage", new { sender = "SYSTEM", content = message });
        }

        public async Task SendMessageToMeeting(string user, string meetingId, string message)
        {
            await Clients.Group(meetingId).SendAsync("ReceiveMessage", new { sender = user, content = message });
        }

        public async Task SendOffer(string toUserId, RTCSessionDescription offer)
        {
            _logger.LogInformation($"Sending offer to {toUserId}");
            try
            {
                await Clients.Client(toUserId).SendAsync("ReceiveOffer", Context.ConnectionId, offer);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message, $"Error sending offer to {toUserId}");
                throw;
            }
        }

        public async Task SendAnswer(string toUserId, RTCSessionDescription answer)
        {
            _logger.LogInformation($"Sending answer to {toUserId}");
            try
            {
                await Clients.Client(toUserId).SendAsync("ReceiveAnswer", Context.ConnectionId, answer);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message, $"Error sending answer to {toUserId}");
                throw;
            }
        }

        public async Task SendIceCandidate(string toUserId, RTCIceCandidateInit iceCandidate)
        {
            _logger.LogInformation($"Sending ICE candidate to {toUserId}");
            try
            {
                await Clients.Client(toUserId).SendAsync("ReceiveIceCandidate", Context.ConnectionId, iceCandidate);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message, $"Error sending ICE candidate to {toUserId}");
                throw;
            }
        }
    }
}