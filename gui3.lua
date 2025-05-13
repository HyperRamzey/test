local DiscordLib = loadstring(game:HttpGet"https://raw.githubusercontent.com/dawid-scripts/UI-Libs/main/discord%20lib.txt")()

local win = DiscordLib:Window("Eclipse Hub")

local serv = win:Server("AdoptMe Eclipse HUB", "")

local btns = serv:Channel("Universal")

btns:Button("Kick all", function()
DiscordLib:Notification("Notification", "Error! Your account is unsafe. Try different one.", "Okay!")
end)

btns:Seperator()

btns:Button("Crash Server", function()
DiscordLib:Notification("Notification", "Error! Your account is unsafe. Try different one.", "Okay!")
end)

local tgls = serv:Channel("Autofarm, TS")

tgls:Toggle("Pet AutoFarm",false, function()
DiscordLib:Notification("Notification", "Error! Your account is unsafe. Try different one.", "Okay!")
end)
tgls:Toggle("Baby AutoFarm",false, function()
DiscordLib:Notification("Notification", "Error! Your account is unsafe. Try different one.", "Okay!")
end)
tgls:Toggle("(NEW) Trade Scam",false, function()
DiscordLib:Notification("Notification", "Error! Your account is unsafe. Try different one.", "Okay!")
end)

local textbs = serv:Channel("Pet Spawner")

textbs:Textbox("Pet Spawner", "Type pet name here!", true, function()
DiscordLib:Notification("Notification", "Error! Your account is unsafe. Try different one.", "Okay!")
end)

serv:Channel("tt @yohd57 eclipseHUB")
