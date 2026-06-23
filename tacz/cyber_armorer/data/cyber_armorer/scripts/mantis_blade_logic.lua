local M = {}

function M.calcSpread(api, num, spread)
    -- 初始化计数器
    local cache = api:getCachedScriptData()
    if (cache == nil) then
        cache = {
            MELEE_COUNT = 1,
            COUNT_SHOOT = 0,
            INPUT_SHOOT = 0,
            SIGNAL_CALCSPREAD = "null"
        }
    end
    -- 根据计数器返回弹道形状
    if (cache.SIGNAL_CALCSPREAD == "ATTACK_1") then
        return{(((-1)^num)*num)/2,-((-1)^num*num)/12}
    elseif (cache.SIGNAL_CALCSPREAD == "ATTACK_2") then
        return{-(((-1)^num)*num)/2,-((-1)^num*num)/12}
    elseif (cache.SIGNAL_CALCSPREAD == "ATTACK_LAST_1") then
        return{(((-1)^num)*num)/12,-((-1)^num*num)/2}
    elseif (cache.SIGNAL_CALCSPREAD == "ATTACK_LAST_2") then
        return{-(((-1)^num)*num)/12,-((-1)^num*num)/2}
    end
end

function M.shoot(api)
    -- 初始化计数器
    local cache = api:getCachedScriptData()
    if (cache == nil) then
        cache = {
            MELEE_COUNT = 1,
            COUNT_SHOOT = 0,
            INPUT_SHOOT = 0,
            SIGNAL_CALCSPREAD = "null"
        }
    end

    cache.INPUT_SHOOT = 1

    if (cache.MELEE_COUNT == 1) then
        cache.COUNT_SHOOT = 4
        cache.SIGNAL_CALCSPREAD = "ATTACK_1"
        cache.MELEE_COUNT = 2
    elseif (cache.MELEE_COUNT == 2) then
        cache.COUNT_SHOOT = 4
        cache.SIGNAL_CALCSPREAD = "ATTACK_2"
        cache.MELEE_COUNT = 3
    elseif (cache.MELEE_COUNT == 3) then
        cache.COUNT_SHOOT = 4
        cache.SIGNAL_CALCSPREAD = "ATTACK_LAST"
        cache.MELEE_COUNT = 1
    end

    api:cacheScriptData(cache)
end

function M.tick_heat(api, heatTimestamp)
    if (api:getAmmoAmount() == 0) then
        api:putAmmoInMagazine(1)
    end
    -- 初始化计数器
    local cache = api:getCachedScriptData()
    if (cache == nil) then
        cache = {
            MELEE_COUNT = 1,
            COUNT_SHOOT = 0,
            INPUT_SHOOT = 0,
            SIGNAL_CALCSPREAD = "null"
        }
    end

    if (cache.INPUT_SHOOT == 1 and cache.COUNT_SHOOT == 0) then
        if (cache.SIGNAL_CALCSPREAD == "ATTACK_1") then
            api:shootOnce(false)
            cache.SIGNAL_CALCSPREAD = "null"
        elseif (cache.SIGNAL_CALCSPREAD == "ATTACK_2") then
            api:shootOnce(false)
            cache.SIGNAL_CALCSPREAD = "null"
        elseif (cache.SIGNAL_CALCSPREAD == "ATTACK_LAST") then
            cache.SIGNAL_CALCSPREAD = "ATTACK_LAST_1"
            api:shootOnce(false)
            cache.SIGNAL_CALCSPREAD = "ATTACK_LAST_2"
            api:shootOnce(false)
            cache.SIGNAL_CALCSPREAD = "null"
        end
    end

    -- 时钟
    if (cache.COUNT_SHOOT > -1) then
        cache.COUNT_SHOOT = cache.COUNT_SHOOT -1
    else
        cache.COUNT_SHOOT = -1
    end

    api:cacheScriptData(cache)
end

return M