import { renderIconSVG } from '@qwtel/blockies';

function colorFromName(name: string) {
    // generate hsl color from name, we only get a hue and sat, lightness is fixed
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    let h = hash % 360;
    let s = 70 + (hash % 30);
    let l = 70;
    return `hsl(${h},${s}%,${l}%)`;
}

let pageCss = document.createElement("style");
pageCss.innerHTML = `
* {
    font-family: Inter, sans-serif;
    color-scheme: dark;
}
:root {
    background-color: #0a0a0a;
}

#hnmain {
    background-color: #1d1d1d;
}

.c00 {
    color: #ffffffc0 !important;
}

.comhead {
    display: flex;
  align-items: center;
  gap: 0.1rem;
}

.hnuser {
    margin-right: 0.4rem;
}

body > center > table > tbody > tr:first-child > td {
    background-color: #2d2d2d;
}

.title a, .pagetop * {
    color: #ffffffc0 !important;
}

.custom-icon {
    display: flex;
   height:100%;
   /* align to top but cneter horizontally*/
   flex-direction: column;
    justify-content: center;

}

.custom-icon svg, .custom-icon img {
    width: 14px;
    height: 14px;
}

.custom-votes {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.2rem;
    width: 3rem;
    flex-shrink: 0;
}

.custom-votes .score {
    color: #ffffffc0;
    font-size: 0.8rem;
}

.custom-content {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}

.custom-content .title {
    color: #ffffff;
}

.custom-content .author {
    font-size: 0.8rem;
    color: #ffffffc0;
    display: flex;
    align-items: center;
    gap: 0.2rem;
}

.custom-content .author svg {
    width: 14px;
    height: 14px;
}

.custom-content .comments {
    font-size: 0.8rem;
    color: #ffffffc0;
}

.row {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

`;

document.documentElement.appendChild(pageCss);

// we want this:
let metaTag = `<meta http-equiv="Content-Security-Policy" content="default-src *;
img-src * 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' *;
style-src  'self' 'unsafe-inline' *">`;

// add it to head
//document.documentElement.innerHTML += metaTag;

// on page content load:
document.addEventListener("DOMContentLoaded", () => {
    let comheads = document.querySelectorAll(".comhead");
    // get .hnuser innerText
    comheads.forEach((comhead) => {
        let hnuser = comhead.querySelector(".hnuser") as HTMLElement;
        if (hnuser) {
            let username = hnuser.innerText;
            // now, prepend avatar from https://avatars.githubusercontent.com/<username> to our hnuser
            //let img = document.createElement("img");
            //img.src = `https://avatars.githubusercontent.com/${username}`;
            //let hash = await sha512(username);
            //let icon = new Identicon(hash, 11).toString();
            //img.src = `data:image/png;base64,${icon}`;
            const svg = renderIconSVG({ seed: username, size: 6, scale: 2 });
            /*img.style.backgroundColor = colorFromName(username);
            img.style.width = "11px";
            img.style.height = "11px";
            img.style.marginRight = "3px";
            // lazyload
            img.loading = "lazy";
             
            hnuser.prepend(img);*/
            //same but svg
            let div = document.createElement("div");
            div.innerHTML = svg;
            div.style.width = "14px";
            div.style.height = "14px";
            div.style.display = "inline-block";
            div.style.marginRight = "3px";
            hnuser.prepend(div);

            hnuser.style.display = "inline-flex";
            hnuser.style.alignItems = "center";
            hnuser.style.color = colorFromName(username);
        }
    });

    // if we are on /news page
    if (window.location.pathname === "/news") {
        // get all .athing
        let athings = document.querySelectorAll(".athing");
        let newContent = document.createElement('div');
        newContent.style.display = 'flex';
        newContent.style.flexDirection = 'column';
        newContent.style.gap = '1rem';
        // for each .athing
        athings.forEach((athing) => {
            // .titleline > a
            let title = athing.querySelector(".titleline > a") as HTMLAnchorElement;
            let postID = athing.id;
            let postURL = 'item?id=' + postID;
            let postContentURL = title.href;
            // get domain
            let postContentDomain = title.hostname;
            // get next <tr> after it
            let nextTr = athing.nextElementSibling as HTMLElement;
            console.log(nextTr);
            // get last <a> in its td > span
            let lastA = nextTr.querySelector("td > span > a:last-child") as HTMLAnchorElement;
            // thats got comment count in it
            let commentCount = lastA.innerText.split(" ")[0];
            let userA = (nextTr.querySelector(".hnuser") as HTMLAnchorElement);
            if (!userA) {
                // its an ad, skip
                nextTr.style.display = "none";
                return;
            }
            let user = userA.href.split("=")[1];
            let userColor = colorFromName(user);
            let score = (nextTr.querySelector(".score") as HTMLElement).innerText.split(" ")[0];
            let age = (nextTr.querySelector(".age > a") as HTMLAnchorElement).innerText;
            // remove nextTr (display none)
            nextTr.style.display = "none";

            let icon = renderIconSVG({ seed: user, size: 6, scale: 2 });

            let pageRealer = `https://icons.duckduckgo.com/ip3/${postContentDomain}.ico`;
            // fetch with csp not murdering us
            let realerOider = fetch(pageRealer, {
                method: "GET",
                headers: {
                    "Content-Type": "image/x-icon",
                    "Access-Control-Allow-Origin": "*"
                }
            });
            realerOider.then((response) => {
                if (response.ok) {
                    console.log("ok");
                }
                console.log(response);
                return response.blob();
            });

            // create a new div
            let newDiv = document.createElement("a");
            newDiv.href = postURL;
            newDiv.style.display = "flex";
            newDiv.style.alignItems = "flex-start";
            newDiv.style.flexDirection = "row";
            newDiv.style.gap = "0.5rem";
            newDiv.innerHTML = `
            <!-- votes first -->
            <div class="custom-votes">
                <div class="votearrow" title="upvote"></div>
                <div class="score">${score}</div>
            </div>
            <!-- icon -->
            <div class="custom-icon">
                
            </div>
            <!-- title and author and comments -->
            <div class="custom-content">
                <div class="title">${title.innerText}</div>
                <div class="row">
                <div class="author" 
                style="color:${userColor};"
                >${icon} ${user}</div>
                <div class="time">${age}</div>
                <div class="comments">${commentCount} comments</div>
                <a href="${postContentURL}">[source]</a>
                </div>
            </div>
            `;
            newContent.appendChild(newDiv);
        });
        // append newcontent, hide old content
        athings[0].parentElement!.appendChild(newContent);
        athings.forEach((athing) => {
            (athing as HTMLElement).style.display = "none";
        });
        // remove all tr.spacer
        let spacers = document.querySelectorAll("tr.spacer");
        spacers.forEach((spacer) => {
            (spacer as HTMLElement).style.display = "none";
        });
    }
});