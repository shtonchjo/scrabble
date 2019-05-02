var bazURLkomenc = "http://www.reta-vortaro.de/revo/"
var bazURLmez = "inx/kap_";
var bazURLfin = ".html";
var alfabet = ["a", "b", "c", "cx", "d", "e", "f", "g", "gx", "h", "hx", "i", "j", "jx", "k", "l", "m", "n", "o", "p", "r", "s", "sx", "t", "u", "ux", "v", "z"];
var dosier = "./RetaVortaroExtract/";
var finajx = ".txt";
var target = "precipa";
var vortolist = [];

//krei liston "vortolist" el chiuj vortoj en Reta Vortaro, ili havas formaton de ligilo
for (var i = 0; i < alfabet.length; i++) {
  const req = new XMLHttpRequest();
  req.open('GET', dosier + alfabet[i] + finajx, false);
  req.send(null);
  if (req.status === 200) {
    var parser = new DOMParser();
    var htmlDoc = parser.parseFromString(req.responseText, 'text/html').getElementsByTagName('a');
    for (var a = 0; a < htmlDoc.length; a++) {
      // kontroli chu:
      // 1-la objekto konsistigas ligon al la celpagho "precipa"
      // 2-la enhavo konsistas el unu vorto
      if ((htmlDoc[a].getAttribute("target") === target) && (htmlDoc[a].innerHTML.indexOf(" ") == -1)) {
        vortolist.push(htmlDoc[a]);
      }
    }
  } else {
    // console.log("Status de la r&eacute;ponse: %d (%s)", req.status, req.statusText);
  }
}

function finad(v, i = 1) {
  return v.substring(v.length - i, v.length)
}

function trancx(v, i = 1) {
  return v.substring(0, v.length - i)
}

function senkomenc(v, i = 1) {
  return v.substring(i, v.length)
}

function cxerp(o) {
  if (o == 'undefined') {
    return null
  } else {
    return o.innerHTML.replace("<b>", "").replace("</b>", "");
  }
}

function senfinig(v) {
  var f = finad(v);
  if ((f == "a") || (f == "e") || (f == "i") || (f == "o")) {
    return trancx(v);
  } else {
    return v;
  }
}

function ikso(v) {
  v = v.toLowerCase();
  v = v.replace("cx", "\u0109");
  v = v.replace("gx", "\u011D");
  v = v.replace("hx", "\u0125");
  v = v.replace("jx", "\u0135");
  v = v.replace("sx", "\u015D");
  v = v.replace("ux", "\u016D");
  return v
}

function sercxado() {
  document.getElementById("rezult").innerHTML = "";
  var sxlosil = ikso(document.getElementById("sercx").value);
  // var maksimum = 1000;
  // var kalkul = 0;
  var bazavortaro = "";
  for (var i = 0; i < vortolist.length; i++) {
    var vort = cxerp(vortolist[i]);
    var senfinavort = senfinig(vort);
    if (finad(senfinavort, sxlosil.length) == sxlosil) {
      if (document.getElementById("piv").checked) {
        lig = vort;
        var bazavortaro = "http://vortaro.net/#";
      } else if (document.getElementById("reta").checked) {
        lig = senkomenc(vortolist[i].outerHTML.split('"')[1], 3);
        var bazavortaro = bazURLkomenc;
      }
      document.getElementById("rezult").innerHTML += "<div><a href='" + bazavortaro + lig + "' target='_blank'>" + senfinavort + "</a></div>";
      // kalkul += 1;
    }
    // if (kalkul >= maksimum) {
    //   break
    // }
  }
}