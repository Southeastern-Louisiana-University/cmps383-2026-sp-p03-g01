namespace Selu383.SP26.Api.Features.Auth;

public class UserDto
{
    public int Id { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int RewardPoints { get; set; }
    public string[] Roles { get; set; } = Array.Empty<string>();
}