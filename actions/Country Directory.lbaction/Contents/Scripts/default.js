include('data.js');

function run() {
    var result = [];
    DATA.forEach(function(country) {
        var item = {
            title: country.country,
            icon: country.iso.toLowerCase(),
            children: [
                {
                    title: country.country,
                    subtitle: country.iso,
                    icon: Action.path + "/Contents/Resources/"+country.iso.toLowerCase()+".gif"
                },
                {
                    title: "Get Current time",
                    url: "https://www.google.ca/search?q=time+in+" + encodeURIComponent(country.country),
                    icon: Action.path + "/Contents/Resources/_clock.png"
                },
                // {
                //     title: "...",
                //     subtitle: "Timezone",
                //     icon: Action.path + "/Contents/Resources/_timezone.png"
                // },
                {
                    title: country.capital,
                    subtitle: "Capital",
                    icon: Action.path + "/Contents/Resources/_star.png"
                },
                {
                    title: country.phone,
                    subtitle: "Phone Extension",
                    icon: Action.path + "/Contents/Resources/_phone.png"
                },
                {
                    title: country.tld,
                    subtitle: "TLD",
                    icon: Action.path + "/Contents/Resources/_internet.png"
                },
                {
                    title: country.currencyname,
                    subtitle: "Currency Name",
                    icon: Action.path + "/Contents/Resources/_moneys.png"
                },
                {
                    title: country.currencycode,
                    subtitle: "Currency Code",
                    icon: Action.path + "/Contents/Resources/_money.png"
                },
                {
                    title: country.languages,
                    subtitle: "Language Codes",
                    icon: Action.path + "/Contents/Resources/_world.png"
                }
            ]
        };

        if (item.icon === "") {
            delete item.icon;
        }
        if (!country.capital) {
            item.children.splice(2, 1);
        }
        result.push(item);
    });

    return result;
}

function runWithString(string) {
    return DATA;
}

/////////////////////////////
function get_time(name) {
    var resp = HTTP.get("https://www.google.ca/search?q=time+in+"+encodeURIComponent(name));
    if (resp === undefined || resp.response.status !== 200) {
        return "???";
    }

}
