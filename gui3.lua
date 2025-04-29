local Library = loadstring(game:HttpGet("https://raw.githubusercontent.com/Robojini/Tuturial_UI_Library/main/UI_Template_1"))()
--[[
]]
--[[
local colors = {
SchemeColor = Color3.fromRGB(255, 0, 0),
Background = Color3.fromRGB(15,15,15),
Header = Color3.fromRGB(15,15,15),
TextColor = Color3.fromRGB(255,255,255),
ElementColor = Color3.fromRGB(255, 0, 0)
}
]]
local Window = Library.CreateLib("X-HUB", "RJTheme3")
local Tab = Window:NewTab("Main")
local Section = Tab:NewSection("Error: Unsafe to execute on this account")
local Section = Tab:NewSection("Features wont work, try a different account!")
Section:NewLabel("Weapon/Pet Spawner")
Section:NewTextBox("Input Weapon/Pet Name", "Weapon/Pet Spawner", function(txt)
print(txt)
end)
