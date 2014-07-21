/*global module, window, define*/

(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.one = root.one || {};
        root.one.validation = factory();
    }
}(this, function () {
    "use strict";

    // Poor man's /x flag:
    // new RegExp(concatRegExps(
    //    /blabla/,
    //    /blablabla/
    // ), "i").test(string);
    function concatRegExps() { // ...
        var source = '',
        i = 0;
        for (; i < arguments.length; i += 1) {
            if (Object.prototype.toString.call(arguments[i]) === '[object RegExp]') {
                source += arguments[i].source;
            } else {
                source += arguments[i];
            }
        }
        return source;
    }

    var ipv4DigitRegExpSource = /(?:[0-9]|1?[0-9][0-9]|2[0-4][0-9]|25[0-5])/.source,
        validation = {
            functions: {}
        },
        fragments = {
            visibleNonAsciiChar: /[ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԥԱ-Ֆՙա-ևא-תװ-ײء-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨऄ-हऽॐक़-ॡॱॲॹ-ॿঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-ళవ-హఽౘౙౠౡಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೞೠೡഅ-ഌഎ-ഐഒ-നപ-ഹഽൠൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄງຈຊຍດ-ທນ-ຟມ-ຣລວສຫອ-ະາຳຽເ-ໄໆໜໝༀཀ-ཇཉ-ཬྈ-ྋက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-Ⴥა-ჺჼᄀ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏼᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᜀ-ᜌᜎ-ᜑᜠ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡷᢀ-ᢨᢪᢰ-ᣵᤀ-ᤜᥐ-ᥭᥰ-ᥴᦀ-ᦫᧁ-ᧇᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭋᮃ-ᮠᮮᮯᰀ-ᰣᱍ-ᱏᱚ-ᱽᳩ-ᳬᳮ-ᳱᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₔℂℇℊ-ℓℕℙ-ℝℤΩℨK-ℭℯ-ℹℼ-ℿⅅ-ⅉⅎↃↄⰀ-Ⱞⰰ-ⱞⱠ-ⳤⳫ-ⳮⴀ-ⴥⴰ-ⵥⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞⸯ々〆〱-〵〻〼ぁ-ゖゝ-ゟァ-ヺー-ヿㄅ-ㄭㄱ-ㆎㆠ-ㆷㇰ-ㇿ㐀-䶵一-鿋ꀀ-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙟꙢ-ꙮꙿ-ꚗꚠ-ꛥꜗ-ꜟꜢ-ꞈꞋꞌꟻ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꪀ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꯀ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-鶴侮-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ̀-ͯ҃-҉֑-ׇֽֿׁׂׅׄؐ-ًؚ-ٰٞۖ-ۜ۞-۪ۤۧۨ-ܑۭܰ-݊ަ-ް߫-߳ࠖ-࠙ࠛ-ࠣࠥ-ࠧࠩ-࠭ऀ-ः़ा-ॎ॑-ॕॢॣঁ-ঃ়া-ৄেৈো-্ৗৢৣਁ-ਃ਼ਾ-ੂੇੈੋ-੍ੑੰੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢૣଁ-ଃ଼ା-ୄେୈୋ-୍ୖୗୢୣஂா-ூெ-ைொ-்ௗఁ-ఃా-ౄె-ైొ-్ౕౖౢౣಂಃ಼ಾ-ೄೆ-ೈೊ-್ೕೖೢೣംഃാ-ൄെ-ൈൊ-്ൗൢൣංඃ්ා-ුූෘ-ෟෲෳัิ-ฺ็-๎ັິ-ູົຼ່-ໍ༹༘༙༵༷༾༿ཱ-྄྆྇ྐ-ྗྙ-ྼ࿆ါ-ှၖ-ၙၞ-ၠၢ-ၤၧ-ၭၱ-ၴႂ-ႍႏႚ-ႝ፟ᜒ-᜔ᜲ-᜴ᝒᝓᝲᝳា-៓៝᠋-᠍ᢩᤠ-ᤫᤰ-᤻ᦰ-ᧀᧈᧉᨗ-ᨛᩕ-ᩞ᩠-᩿᩼ᬀ-ᬄ᬴-᭄᭫-᭳ᮀ-ᮂᮡ-᮪ᰤ-᰷᳐-᳔᳒-᳨᳭ᳲ᷀-᷽ᷦ-᷿⃐-⃰⳯-⳱ⷠ-〪ⷿ-゙゚〯꙯-꙲꙼꙽꛰꛱ꠂ꠆ꠋꠣ-ꠧꢀꢁꢴ-꣄꣠-꣱ꤦ-꤭ꥇ-꥓ꦀ-ꦃ꦳-꧀ꨩ-ꨶꩃꩌꩍꩻꪰꪲ-ꪴꪷꪸꪾ꪿꫁ꯣ-ꯪ꯬꯭ﬞ︀-️︠-︦²³¹¼-¾٠-٩۰-۹߀-߉०-९০-৯৴-৹੦-੯૦-૯୦-୯௦-௲౦-౯౸-౾೦-೯൦-൵๐-๙໐-໙༠-༳၀-၉႐-႙፩-፼ᛮ-ᛰ០-៩៰-៹᠐-᠙᥆-᥏᧐-᧚᪀-᪉᪐-᪙᭐-᭙᮰-᮹᱀-᱉᱐-᱙⁰⁴-⁹₀-₉⅐-ↂↅ-↉①-⒛⓪-⓿❶-➓⳽〇〡-〩〸-〺㆒-㆕㈠-㈩㉑-㉟㊀-㊉㊱-㊿꘠-꘩ꛦ-ꛯ꠰-꠵꣐-꣙꤀-꤉꧐-꧙꩐-꩙꯰-꯹０-９¡«·»¿;·՚-՟։֊־׀׃׆׳״؉؊،؍؛؞؟٪-٭۔܀-܍߷-߹࠰-࠾।॥॰෴๏๚๛༄-༒༺-༽྅࿐-࿔၊-၏჻፡-፨᐀᙭᙮᚛᚜᛫-᛭᜵᜶។-៖៘-៚᠀-᠊᥄᥅᧞᧟᨞᨟᪠-᪦᪨-᪭᭚-᭠᰻-᰿᱾᱿᳓‐-‧‰-⁃⁅-⁑⁓-⁞⁽⁾₍₎〈〉❨-❵⟅⟆⟦-⟯⦃-⦘⧘-⧛⧼⧽⳹-⳼⳾⳿⸀-⸮⸰⸱、-〃〈-】〔-〟〰〽゠・꓾꓿꘍-꘏꙳꙾꛲-꛷꡴-꡷꣎꣏꣸-꣺꤮꤯꥟꧁-꧍꧞꧟꩜-꩟꫞꫟꯫﴾﴿︐-︙︰-﹒﹔-﹡﹣﹨﹪﹫！-＃％-＊，-／：；？＠［-］＿｛｝｟-･¢-©¬®-±´¶¸×÷˂-˅˒-˟˥-˫˭˯-˿͵΄΅϶҂؆-؈؋؎؏۩۽۾߶৲৳৺৻૱୰௳-௺౿ೱೲ൹฿༁-༃༓-༗༚-༟༴༶༸྾-࿅࿇-࿌࿎࿏࿕-࿘႞႟፠᎐-᎙៛᥀᧠-᧿᭡-᭪᭴-᭼᾽᾿-῁῍-῏῝-῟῭-`´῾⁄⁒⁺-⁼₊-₌₠-₸℀℁℃-℆℈℉℔№-℘℞-℣℥℧℩℮℺℻⅀-⅄⅊-⅍⅏←-⌨⌫-⏨␀-␦⑀-⑊⒜-ⓩ─-⛍⛏-⛡⛣⛨-⛿✁-✄✆-✉✌-✧✩-❋❍❏-❒❖-❞❡-❧➔➘-➯➱-➾⟀-⟄⟇-⟊⟌⟐-⟥⟰-⦂⦙-⧗⧜-⧻⧾-⭌⭐-⭙⳥-⳪⺀-⺙⺛-⻳⼀-⿕⿰-⿻〄〒〓〠〶〷〾〿゛゜㆐㆑㆖-㆟㇀-㇣㈀-㈞㈪-㉐㉠-㉿㊊-㊰㋀-㋾㌀-㏿䷀-䷿꒐-꓆꜀-꜖꜠꜡꞉꞊꠨-꠫꠶-꠹꩷-꩹﬩﷼﷽﹢﹤-﹦﹩＄＋＜-＞＾｀｜～￠-￦￨-￮￼�]/,
            tld: /(?:xn--(?:3bst00m|3ds443g|3e0b707e|45brj9c|4gbrim|55qw42g|55qx5d|6frz82g|6qq986b3xl|80adxhks|80ao21a|80asehdb|80aswg|90a3ac|c1avg|cg4bki|clchc0ea0b2g2a9gcd|czr694b|czru2d|d1acj3b|fiq228c5hs|fiq64b|fiqs8s|fiqz9s|fpcrj9c3d|fzc2c9e2c|gecrj9c|h2brj9c|i1b6b1a6a2e|io0a7i|j1amh|j6w193g|kprw13d|kpry57d|l1acc|lgbbat1ad8j|mgb9awbf|mgba3a4f16a|mgbaam7a8h|mgbab2bd|mgbayh7gpa|mgbbh1a71e|mgbc0a9azcg|mgberp4a5d4ar|mgbx4cd0ab|ngbc5azd|nqv7f|nqv7fs00ema|o3cw4h|ogbpf8fl|p1ai|pgbs0dh|q9jyb4c|rhqv96g|s9brj9c|ses554g|unup4y|wgbh1c|wgbl6a|xkc2al3hye2a|xkc2dl3a5ee0h|yfro4i67o|ygbi2ammx|zfr164b)|international|versicherung|construction|சிங்கப்பூர்|productions|photography|motorcycles|investments|enterprises|engineering|contractors|blackfriday|accountants|university|technology|republican|properties|management|industries|immobilien|foundation|creditcard|consulting|associates|vacations|solutions|marketing|institute|furniture|financial|equipment|education|directory|community|christmas|السعودية|yokohama|ventures|training|supplies|software|services|saarland|plumbing|pictures|partners|mortgage|lighting|holdings|graphics|feedback|exchange|engineer|discount|diamonds|democrat|computer|clothing|cleaning|catering|builders|boutique|bargains|attorney|airforce|இந்தியா|الجزائر|website|systems|surgery|support|singles|shiksha|reviews|rentals|recipes|okinawa|neustar|limited|kitchen|holiday|hamburg|guitars|gallery|frogans|florist|flights|fitness|fishing|finance|exposed|domains|digital|dentist|cruises|country|cooking|company|cologne|college|careers|capital|academy|இலங்கை|مليسيا|فلسطين|امارات|المغرب|الاردن|онлайн|москва|yachts|webcam|voyage|voting|vision|villas|viajes|travel|tienda|tattoo|supply|social|schule|ryukyu|report|repair|reisen|quebec|photos|nagoya|museum|moscow|monash|market|maison|luxury|london|lawyer|kaufen|juegos|insure|hiphop|gratis|global|futbol|expert|events|estate|dental|degree|dating|credit|condos|coffee|clinic|claims|church|center|career|camera|berlin|bayern|agency|భారత్|संगठन|سورية|بھارت|بازار|ایران|works|watch|vodka|vegas|trade|tools|tokyo|today|tirol|space|solar|shoes|rodeo|rocks|reise|rehab|press|photo|parts|paris|ninja|miami|media|mango|loans|lease|koeln|jetzt|house|horse|homes|guide|gripe|globo|glass|gives|email|dance|codes|citic|cheap|cards|build|black|autos|audio|archi|actor|组织机构|ලංකා|ભારત|ਭਾਰਤ|ভারত|भारत|موقع|عمان|شبكة|تونس|сайт|дети|zone|wiki|wien|wang|voto|vote|toys|town|tips|sohu|sexy|ruhr|rich|rest|qpon|post|pink|pics|navy|name|moda|mobi|menu|meet|luxe|link|limo|life|land|kred|kiwi|jobs|info|host|haus|guru|gift|fund|fish|farm|fail|desi|coop|cool|club|cash|care|camp|buzz|blue|bike|best|beer|asia|arpa|army|aero|新加坡|我爱你|中文网|みんな|ไทย|مصر|قطر|қаз|укр|срб|орг|мон|xyz|xxx|wtf|wtc|wed|vet|uno|tel|tax|soy|rio|ren|red|pub|pro|org|onl|nyc|nhk|net|moe|mil|kim|int|ink|hiv|gov|gop|gmo|gal|foo|eus|edu|dnp|com|ceo|cat|cab|biz|bio|bid|bar|axa|한국|삼성|香港|集团|网络|网址|移动|游戏|机构|政务|在线|商标|商城|台灣|台湾|公益|公司|中國|中国|中信|世界|рф|z[amw]|y[et]|w[fs]|v[aceginu]|u[agksyz]|t[cdfghjklmnoprtvwz]|s[abcdeghijklmnortuvxyz]|r[eosuw]|qa|p[aefghklmnrstwy]|om|n[acefgilopruz]|m[acdeghklmnopqrstuvwxyz]|l[abcikrstuvy]|k[eghimnprwyz]|j[emop]|i[delmnoqrst]|h[kmnrtu]|g[abdefghilmnpqrstuwy]|f[ijkmor]|e[cegrstu]|d[ejkmoz]|c[acdfghiklmnoruvwxyz]|b[abdefghijmnorstvwyz]|a[cdefgilmnoqrstuwxz])/i, // See /lib/tld.js
            domainPart: /[a-z0-9](?:[\-a-z0-9]*[a-z0-9])?/i,
            port: /\d{1,5}/,
            localpart: /[a-z0-9!#$%&'*+\/=?\^_`{|}~\-:]+(?:\.[a-z0-9!#$%&'*+\/=?\^_`{|}~\-]+)*/i, // taken from: http://www.regular-expressions.info/email.html
            localpartRelaxed: /[a-z0-9!#$%&'*+\/=?\^_`{|}~\-:][\.a-z0-9!#$%&'*+\/=?\^_`{|}~\-]*/i, // taken from: http://www.regular-expressions.info/email.html
            user: /[^:@\/]+/i,
            uuid: /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i,
            lowerCaseUuid: /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/,
            upperCaseUuid: /[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}/,
            password: /[^@\/]+?/i,
            pathname: /[\w\-\.~%!$&'\(\)*+,;=:@\/]*/,
            search:   /[\w\-\.~%!$&'\(\)*+,;=:@\/?]*/,
            hash:     /[\w\-\.~%!$&'\(\)*+,;=:@\/?#]*/,
            ipv4: new RegExp('(?:' + ipv4DigitRegExpSource + '\\.){3}' + ipv4DigitRegExpSource)
        },
        name;

    // Highlevel regexes composed of regex fragments
    var alphanumericalPlusVisibleNonAsciiChars = new RegExp(fragments.visibleNonAsciiChar.source.replace(/^\[/, '[a-z0-9'));
    fragments.domainPartIdn = new RegExp(concatRegExps(alphanumericalPlusVisibleNonAsciiChars,
                                                       '(?:',
                                                       new RegExp(alphanumericalPlusVisibleNonAsciiChars.source.replace(/^\[/, '[\\-') + '*'),
                                                       alphanumericalPlusVisibleNonAsciiChars,
                                                       ')?'));

    fragments.domain = fragments.domainName = new RegExp("(?:" + fragments.domainPart.source + "\\.)+" + fragments.tld.source, "i");
    fragments.domainIdn = fragments.domainNameIdn = new RegExp("(?:" + fragments.domainPartIdn.source + "\\.)+" + fragments.tld.source, "i");
    fragments.domainRelaxed = fragments.domainNameRelaxed = new RegExp("(?:" + fragments.domainPart.source + "\\.)+" + fragments.domainPart.source, "i");
    fragments.domainRelaxedIdn = fragments.domainNameRelaxedIdn = new RegExp("(?:" + fragments.domainPartIdn.source + "\\.)+" + fragments.domainPartIdn.source, "i");

    fragments.email = fragments.emailAddress = new RegExp(fragments.localpart.source + "@" + fragments.domain.source, "i");
    fragments.emailRelaxed = fragments.emailAddressRelaxed =new RegExp(fragments.localpartRelaxed.source + "@" + fragments.domainRelaxed.source, "i");
    fragments.emailRelaxedIdn = fragments.emailAddressRelaxedIdn = new RegExp(fragments.localpartRelaxed.source + "@" + fragments.domainRelaxedIdn.source, "i");
    fragments.mailtoUrl = new RegExp("mailto:" + fragments.email.source, "i"); // TODO: This needs to be improved
    fragments.mailtoUrlRelaxed = new RegExp("mailto:" + fragments.emailRelaxed.source, "i"); // TODO: This needs to be improved
    fragments.mailtoUrlRelaxedIdn = new RegExp("mailto:" + fragments.emailRelaxedIdn.source, "i"); // TODO: This needs to be improved

    // Same as location.pathname + location.search + location.hash in the browser:
    fragments.pathnameSearchHash = new RegExp(concatRegExps(
        "(?:/", fragments.pathname,
            "(?:\\?", fragments.search, ")?",
            "(?:#", fragments.hash, ")?",
        ")?" // See http://www.ietf.org/rfc/rfc1738.txt
    ));

    function createHttpishUrlRegExp(options) {
        // [protocol"://"[username[":"password]"@"]hostname[":"port]"/"?][path]["?"querystring]["#"fragment]
        options = options || {};
        return new RegExp(concatRegExps(
            (options.scheme || 'https?'), "://",
            "(?:",
                fragments.user,
                "(?::",
                    fragments.password,
                ")?@",
            ")?",
            "(?:",
                (options.localhost ? 'localhost|' : ''),
                options.relaxed ? (options.idn ? fragments.domainRelaxedIdn : fragments.domainRelaxed) : (options.idn ? fragments.domainIdn : fragments.domain),
                "|",
                fragments.ipv4,
            ")",
            "(?::", fragments.port, ")?",
            fragments.pathnameSearchHash
        ), "i");
    }

    fragments.httpUrl = createHttpishUrlRegExp({scheme: /https?/});
    fragments.httpUrlIdn = createHttpishUrlRegExp({scheme: /https?/, idn: true});
    fragments.httpUrlRelaxed = createHttpishUrlRegExp({scheme: /https?/, relaxed: true});
    fragments.httpUrlRelaxedIdn = createHttpishUrlRegExp({scheme: /https?/, relaxed: true, idn: true});
    fragments.ftpUrl = createHttpishUrlRegExp({scheme: /ftp/});
    fragments.ftpUrlIdn = createHttpishUrlRegExp({scheme: /ftp/, idn: true});
    fragments.ftpUrlRelaxed = createHttpishUrlRegExp({scheme: /ftp/, relaxed: true});
    fragments.ftpUrlRelaxedIdn = createHttpishUrlRegExp({scheme: /ftp/, relaxed: true, idn: true});

    // Alias 'httpUrl' as 'url' for backwards compatibility:
    fragments.url = fragments.httpUrl;

    function getFlagsStringFromRegExp(regExp) {
        var flagsString = '';
        if (regExp.ignoreCase) {
            flagsString += 'i';
        }
        if (regExp.global) {
            flagsString += 'g';
        }
        if (regExp.multiline) {
            flagsString += 'm';
        }
        return flagsString;
    }

    // Add convenience regexes and functions
    for (name in fragments) {
        if (fragments.hasOwnProperty(name)) {
            validation[name] = new RegExp("^" + fragments[name].source + "$", getFlagsStringFromRegExp(fragments[name]));
            validation.functions[name] = (function (name) {
                return function (value) {
                    return validation[name].test(value);
                };
            }(name));
        }
    }

    // Expose regex fragments for matching inside larger texts
    validation.fragments = fragments;

    validation.createHttpishUrlRegExp = createHttpishUrlRegExp;

    return validation;
}));

