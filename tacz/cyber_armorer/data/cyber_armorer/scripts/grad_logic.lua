local M = {}

function M.start_reload(api)
    local cache = {
        reloaded_flag = 0,
        needed_count = api:getNeededAmmoAmount(),
        is_tactical = api:getReloadStateType() == TACTICAL_RELOAD_FEEDING,
    }
    api:cacheScriptData(cache)
    return true
end

local function getReloadTimingFromParam(param)
    local reload_feed = param.reload_feed * 1000
    local reload_cooldown = param.reload_cooldown * 1000
    local empty_feed = param.empty_feed * 1000
    local empty_cooldown = param.empty_cooldown * 1000
    if (reload_feed == nil or reload_cooldown == nil or empty_cooldown == nil or empty_feed == nil) then
        return nil
    end
    return reload_feed, reload_cooldown, empty_feed, empty_cooldown
end

function M.tick_reload(api)
    local param = api:getScriptParams();
    local cache = api:getCachedScriptData();
    local reload_feed, reload_cooldown, empty_feed, empty_cooldown = getReloadTimingFromParam(param)
    local reload_time = api:getReloadTime()
    if (reload_feed == nil or reload_cooldown == nil or empty_cooldown == nil or empty_feed == nil) then
        return nil
    end
    if (cache.is_tactical) then
        if (reload_time < reload_feed) then
            return TACTICAL_RELOAD_FEEDING, reload_feed - reload_time
        elseif (reload_time >= reload_feed and reload_time < reload_cooldown) then
            if (cache.reloaded_flag ~= 1) then
                if (api:isReloadingNeedConsumeAmmo()) then
                    api:putAmmoInMagazine(api:consumeAmmoFromPlayer(cache.needed_count))
                else
                    api:putAmmoInMagazine(cache.needed_count)
                end
                cache.reloaded_flag = 1
            end
            return TACTICAL_RELOAD_FINISHING, reload_cooldown - reload_time
        else
            return NOT_RELOADING, -1
        end
    else
        if (reload_time < empty_feed) then
            return EMPTY_RELOAD_FEEDING, empty_feed - reload_time
        elseif (reload_time >= empty_feed and reload_time < empty_cooldown) then
            if (cache.reloaded ~= 1) then
                if (api:isReloadingNeedConsumeAmmo()) then
                    api:putAmmoInMagazine(api:consumeAmmoFromPlayer(cache.needed_count + 1))
                else
                    api:putAmmoInMagazine(cache.needed_count + 1)
                end
                api:setAmmoInBarrel(true)
                cache.reloaded = 1
            end
            return EMPTY_RELOAD_FINISHING, empty_cooldown - reload_time
        else
            return NOT_RELOADING, -1
        end
    end
end

return M