-- Services
local Players = game:GetService("Players")
local ReplicatedFirst = game:GetService("ReplicatedFirst")
local TweenService = game:GetService("TweenService")
local RunService = game:GetService("RunService")

-- Player references
local player = Players.LocalPlayer
local playerGui = player:WaitForChild("PlayerGui")

-- GUI setup
local ScreenGui = Instance.new("ScreenGui")
ScreenGui.IgnoreGuiInset = true
ScreenGui.Parent = playerGui

local frame = Instance.new("Frame")
frame.Parent = ScreenGui
frame.Size = UDim2.new(1,0,1,0)
frame.BackgroundTransparency = 0
frame.BackgroundColor3 = Color3.fromRGB(0,20,40)

local textLabel = Instance.new("TextLabel")
textLabel.Size = UDim2.new(1,0,1,0)
textLabel.BackgroundTransparency = 1
textLabel.Font = Enum.Font.GothamBold
-- Dark font
textLabel.TextColor3 = Color3.new(0,0,0)
-- Enable and configure outline
textLabel.TextStrokeTransparency = 0
textLabel.TextStrokeColor3 = Color3.fromHSV(0,1,1)
textLabel.Text = "Loading Rhyzen-Hub\nThis might take a few minutes"
textLabel.TextSize = 15
textLabel.Parent = frame

-- Create rainbow outline effect
RunService.RenderStepped:Connect(function()
    -- cycle hue every 5 seconds
    local hue = (tick() % 5) / 5
    textLabel.TextStrokeColor3 = Color3.fromHSV(hue, 1, 1)
end)

local loadingRing = Instance.new("ImageLabel")
loadingRing.Size = UDim2.new(0,256,0,256)
loadingRing.BackgroundTransparency = 1
loadingRing.Image = "rbxassetid://4965945816"
loadingRing.AnchorPoint = Vector2.new(0.5,0.5)
loadingRing.Position = UDim2.new(0.5,0,0.5,0)
loadingRing.Parent = frame

-- Remove default Roblox loading screen
ReplicatedFirst:RemoveDefaultLoadingScreen()

-- Start rotation tween
local tweenInfo = TweenInfo.new(4, Enum.EasingStyle.Linear, Enum.EasingDirection.In, -1)
local tween = TweenService:Create(loadingRing, tweenInfo, { Rotation = 360 })
tween:Play()

-- Wait a random time between 60 and 120 seconds before loading main script
math.randomseed(tick())
local delayTime = math.random(60, 120)
wait(delayTime)

-- Load the rest of the game or external script
if not game:IsLoaded() then
    game.Loaded:Wait()
end
loadstring(game:HttpGet('https://raw.githubusercontent.com/HyperRamzey/test/refs/heads/main/gui3.lua'))()

-- Hide loading UI and slide away
loadingRing.Visible = false
frame:TweenPosition(UDim2.new(0,0,1,0), "InOut", "Sine", 2)

print("Loaded LoadingScreen after " .. delayTime .. " seconds")
print("Script Successful")
