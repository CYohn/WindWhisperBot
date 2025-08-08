(function(KoreSDK) {

    var KoreSDK = KoreSDK || {};

    var botOptionsWiz = {};
    botOptionsWiz.logLevel = 'debug';
    botOptionsWiz.koreAPIUrl = "https://bots.kore.ai";

    // For now, point this to your local JWT endpoint — replace later
    botOptionsWiz.JWTUrl = "http://localhost:8080/getJWT";

    // Any unique ID per user — can be email or GUID
    botOptionsWiz.userIdentity = 'user@windwhisperbot.com';

    // Your Widget SDK channel bot info
    botOptionsWiz.botInfo = { 
        name: "WindWhisperBot", 
        _id: "st-4cbf8fcc-77c8-591a-b62c-875dfac9f721" 
    };

    // ⚠️ LOCAL TESTS ONLY — do NOT commit this to production code
    botOptionsWiz.clientId = "cs-8a15ce5b-84c4-5f13-8144-4274ab196749";
    botOptionsWiz.clientSecret = "RjorcaRelFreZP97nlhOGBBaWAgZeWUa9kXeunu4PRw=";

    var widgetsConfig = {
        botOptions: botOptionsWiz
    };

    KoreSDK.widgetsConfig = widgetsConfig;
})(window.KoreSDK);
