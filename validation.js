/*global module, define*/

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
    'use strict';

    // Poor man's /x flag:
    // new RegExp(concatRegExps(
    //    /blabla/,
    //    /blablabla/
    // ), 'i').test(string);
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
            visibleNonAsciiChar: /[ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԥԱ-Ֆՙա-ևא-תװ-ײء-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨऄ-हऽॐक़-ॡॱॲॹ-ॿঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-ళవ-హఽౘౙౠౡಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೞೠೡഅ-ഌഎ-ഐഒ-നപ-ഹഽൠൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄງຈຊຍດ-ທນ-ຟມ-ຣລວສຫອ-ະາຳຽເ-ໄໆໜໝༀཀ-ཇཉ-ཬྈ-ྋက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-Ⴥა-ჺჼᄀ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏼᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᜀ-ᜌᜎ-ᜑᜠ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡷᢀ-ᢨᢪᢰ-ᣵᤀ-ᤜᥐ-ᥭᥰ-ᥴᦀ-ᦫᧁ-ᧇᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭋᮃ-ᮠᮮᮯᰀ-ᰣᱍ-ᱏᱚ-ᱽᳩ-ᳬᳮ-ᳱᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₔℂℇℊ-ℓℕℙ-ℝℤΩℨK-ℭℯ-ℹℼ-ℿⅅ-ⅉⅎↃↄⰀ-Ⱞⰰ-ⱞⱠ-ⳤⳫ-ⳮⴀ-ⴥⴰ-ⵥⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞⸯ々〆〱-〵〻〼ぁ-ゖゝ-ゟァ-ヺー-ヿㄅ-ㄭㄱ-ㆎㆠ-ㆷㇰ-ㇿ㐀-䶵一-鿋ꀀ-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙟꙢ-ꙮꙿ-ꚗꚠ-ꛥꜗ-ꜟꜢ-ꞈꞋꞌꟻ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꪀ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꯀ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-鶴侮-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ̀-ͯ҃-҉֑-ׇֽֿׁׂׅׄؐ-ًؚ-ٰٞۖ-ۜ۞-۪ۤۧۨ-ܑۭܰ-݊ަ-ް߫-߳ࠖ-࠙ࠛ-ࠣࠥ-ࠧࠩ-࠭ऀ-ः़ा-ॎ॑-ॕॢॣঁ-ঃ়া-ৄেৈো-্ৗৢৣਁ-ਃ਼ਾ-ੂੇੈੋ-੍ੑੰੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢૣଁ-ଃ଼ା-ୄେୈୋ-୍ୖୗୢୣஂா-ூெ-ைொ-்ௗఁ-ఃా-ౄె-ైొ-్ౕౖౢౣಂಃ಼ಾ-ೄೆ-ೈೊ-್ೕೖೢೣംഃാ-ൄെ-ൈൊ-്ൗൢൣංඃ්ා-ුූෘ-ෟෲෳัิ-ฺ็-๎ັິ-ູົຼ່-ໍ༹༘༙༵༷༾༿ཱ-྄྆྇ྐ-ྗྙ-ྼ࿆ါ-ှၖ-ၙၞ-ၠၢ-ၤၧ-ၭၱ-ၴႂ-ႍႏႚ-ႝ፟ᜒ-᜔ᜲ-᜴ᝒᝓᝲᝳា-៓៝᠋-᠍ᢩᤠ-ᤫᤰ-᤻ᦰ-ᧀᧈᧉᨗ-ᨛᩕ-ᩞ᩠-᩿᩼ᬀ-ᬄ᬴-᭄᭫-᭳ᮀ-ᮂᮡ-᮪ᰤ-᰷᳐-᳔᳒-᳨᳭ᳲ᷀-᷽ᷦ-᷿⃐-⃰⳯-⳱ⷠ-〪ⷿ-゙゚〯꙯-꙲꙼꙽꛰꛱ꠂ꠆ꠋꠣ-ꠧꢀꢁꢴ-꣄꣠-꣱ꤦ-꤭ꥇ-꥓ꦀ-ꦃ꦳-꧀ꨩ-ꨶꩃꩌꩍꩻꪰꪲ-ꪴꪷꪸꪾ꪿꫁ꯣ-ꯪ꯬꯭ﬞ︀-️︠-︦²³¹¼-¾٠-٩۰-۹߀-߉०-९০-৯৴-৹੦-੯૦-૯୦-୯௦-௲౦-౯౸-౾೦-೯൦-൵๐-๙໐-໙༠-༳၀-၉႐-႙፩-፼ᛮ-ᛰ០-៩៰-៹᠐-᠙᥆-᥏᧐-᧚᪀-᪉᪐-᪙᭐-᭙᮰-᮹᱀-᱉᱐-᱙⁰⁴-⁹₀-₉⅐-ↂↅ-↉①-⒛⓪-⓿❶-➓⳽〇〡-〩〸-〺㆒-㆕㈠-㈩㉑-㉟㊀-㊉㊱-㊿꘠-꘩ꛦ-ꛯ꠰-꠵꣐-꣙꤀-꤉꧐-꧙꩐-꩙꯰-꯹０-９¡«·»¿;·՚-՟։֊־׀׃׆׳״؉؊،؍؛؞؟٪-٭۔܀-܍߷-߹࠰-࠾।॥॰෴๏๚๛༄-༒༺-༽྅࿐-࿔၊-၏჻፡-፨᐀᙭᙮᚛᚜᛫-᛭᜵᜶។-៖៘-៚᠀-᠊᥄᥅᧞᧟᨞᨟᪠-᪦᪨-᪭᭚-᭠᰻-᰿᱾᱿᳓‐-‧‰-⁃⁅-⁑⁓-⁞⁽⁾₍₎〈〉❨-❵⟅⟆⟦-⟯⦃-⦘⧘-⧛⧼⧽⳹-⳼⳾⳿⸀-⸮⸰⸱、-〃〈-】〔-〟〰〽゠・꓾꓿꘍-꘏꙳꙾꛲-꛷꡴-꡷꣎꣏꣸-꣺꤮꤯꥟꧁-꧍꧞꧟꩜-꩟꫞꫟꯫﴾﴿︐-︙︰-﹒﹔-﹡﹣﹨﹪﹫！-＃％-＊，-／：；？＠［-］＿｛｝｟-･¢-©¬®-±´¶¸×÷˂-˅˒-˟˥-˫˭˯-˿͵΄΅϶҂؆-؈؋؎؏۩۽۾߶৲৳৺৻૱୰௳-௺౿ೱೲ൹฿༁-༃༓-༗༚-༟༴༶༸྾-࿅࿇-࿌࿎࿏࿕-࿘႞႟፠᎐-᎙៛᥀᧠-᧿᭡-᭪᭴-᭼᾽᾿-῁῍-῏῝-῟῭-`´῾⁄⁒⁺-⁼₊-₌₠-₸℀℁℃-℆℈℉℔№-℘℞-℣℥℧℩℮℺℻⅀-⅄⅊-⅍⅏←-⌨⌫-⏨␀-␦⑀-⑊⒜-ⓩ─-⛍⛏-⛡⛣⛨-⛿✁-✄✆-✉✌-✧✩-❋❍❏-❒❖-❞❡-❧➔➘-➯➱-➾⟀-⟄⟇-⟊⟌⟐-⟥⟰-⦂⦙-⧗⧜-⧻⧾-⭌⭐-⭙⳥-⳪⺀-⺙⺛-⻳⼀-⿕⿰-⿻〄〒〓〠〶〷〾〿゛゜㆐㆑㆖-㆟㇀-㇣㈀-㈞㈪-㉐㉠-㉿㊊-㊰㋀-㋾㌀-㏿䷀-䷿꒐-꓆꜀-꜖꜠꜡꞉꞊꠨-꠫꠶-꠹꩷-꩹﬩﷼﷽﹢﹤-﹦﹩＄＋＜-＞＾｀｜～￠-￦￨-\uffee\ufffc\ufffd]/,
            printableAsciiChar: /[\x21-\x7e]*/,
            visibleAsciiChar: /[\x20-\x7e]*/,
            subDomainPart: /[_a-z0-9](?:[_\-a-z0-9]*[_a-z0-9])?/i,
            domainPart: /[a-z0-9](?:[\-a-z0-9]*[a-z0-9])?/i,
            punycodeTld: /xn\-\-[a-z0-9]{4,}/i,
            tld: /[a-z][\-a-z]*[a-z]/i,
            port: /\d{1,5}/,
            localpart: /[a-z0-9!#$%&'*+\/=?\^_`{|}~\-:][\.a-z0-9!#$%&'*+\/=?\^_`{|}~\-]*/i, // taken from: http://www.regular-expressions.info/email.html
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
    var alphanumericalPlusVisibleNonAsciiChars = new RegExp(fragments.visibleNonAsciiChar.source.replace(/^\[/, '[a-z0-9')),
        alphabeticalPlusVisibleNonAsciiChars = new RegExp(fragments.visibleNonAsciiChar.source.replace(/^\[/, '[a-z'));
    fragments.domainPartIdn = new RegExp(concatRegExps(alphanumericalPlusVisibleNonAsciiChars,
                                                       '(?:',
                                                       new RegExp(alphanumericalPlusVisibleNonAsciiChars.source.replace(/^\[/, '[\\-') + '*'),
                                                       alphanumericalPlusVisibleNonAsciiChars,
                                                       ')?'));
    fragments.tldIdn = new RegExp(concatRegExps(alphabeticalPlusVisibleNonAsciiChars,
                                                       new RegExp(alphabeticalPlusVisibleNonAsciiChars.source.replace(/^\[/, '[\\-') + '*'),
                                                       alphabeticalPlusVisibleNonAsciiChars));

    // TODO: Consider disallowing invalid IDN domains, e.g. one-letter TLD "foo.æ" which has an ASCII representation of "foo.xn--6ca"

    // punycodetld source should come first than the normal tld because its a subset of normal tld.
    fragments.domain = fragments.domainName = new RegExp('(?:' + fragments.subDomainPart.source + '\\.)*' + '(?:' + fragments.domainPart.source + '\\.)+' + '(?:' + '(?:' + fragments.punycodeTld.source + ')' + '|(?:' + fragments.tld.source + '))', 'i');
    fragments.domainIdn = fragments.domainNameIdn = new RegExp('(?:' + fragments.domainPartIdn.source + '\\.)+' + fragments.tldIdn.source, 'i');

    fragments.email = fragments.emailAddress = new RegExp(fragments.localpart.source + '@' + fragments.domain.source, 'i');
    fragments.emailIdn = fragments.emailAddressIdn = new RegExp(fragments.localpart.source + '@' + fragments.domainIdn.source, 'i');
    fragments.mailtoUrl = new RegExp('mailto:' + fragments.email.source, 'i'); // TODO: This needs to be improved
    fragments.mailtoUrlIdn = new RegExp('mailto:' + fragments.emailIdn.source, 'i'); // TODO: This needs to be improved

    // Same as location.pathname + location.search + location.hash in the browser:
    fragments.searchHash = new RegExp(concatRegExps(
        '(?:\\?', fragments.search, ')?',
        '(?:#', fragments.hash, ')?'
    ));
    fragments.pathnameSearchHash = new RegExp(concatRegExps(
        '(?:', fragments.pathname,
            fragments.searchHash,
        ')?' // See http://www.ietf.org/rfc/rfc1738.txt
    ));

    // Root-relative URL. Same as pathnameSearchHash, except it can't be empty
    fragments.rootRelativeUrl = new RegExp(concatRegExps(
        '/',
        new RegExp(fragments.pathnameSearchHash.source.replace(/\?$/, '')
    )));

    function createHttpishUrlRegExp(options) {
        // [protocol"://"[username[":"password]"@"]hostname[":"port]"/"?][path]["?"querystring]["#"fragment]
        options = options || {};
        return new RegExp(concatRegExps(
            (options.scheme || 'https?'), '://',
            '(?:',
                fragments.user,
                '(?::',
                    fragments.password,
                ')?@',
            ')?',
            '(?:',
                (options.localhost ? 'localhost|' : ''),
                (options.idn ? fragments.domainIdn : fragments.domain),
                '|',
                fragments.ipv4,
            ')',
            '(?::', fragments.port, ')?',
            '(?:/', fragments.pathnameSearchHash, '|', fragments.searchHash, ')'
        ), 'i');
    }

    fragments.httpUrl = createHttpishUrlRegExp({scheme: /https?/});
    fragments.httpUrlIdn = createHttpishUrlRegExp({scheme: /https?/, idn: true});
    fragments.ftpUrl = createHttpishUrlRegExp({scheme: /ftp/});
    fragments.ftpUrlIdn = createHttpishUrlRegExp({scheme: /ftp/, idn: true});

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
            validation[name] = new RegExp('^' + fragments[name].source + '$', getFlagsStringFromRegExp(fragments[name]));
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

