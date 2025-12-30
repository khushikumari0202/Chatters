export function formatMessageTime(date){
    return new Date(date).toLocaleTimeString("en-IN", {timeZone: "Asia/Kolkata", hour12: true, hour: "2-digit", minute: "2-digit"});
}