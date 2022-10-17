(function (factory) {
	if (typeof define === 'function' && define.amd) {
		define(['@js/core'], factory)
	} else if (typeof module === 'object' && module.exports) {
		module.exports = factory(require('@tyler.thayn/js.core'))
	} else {
		factory()
	}
}(function () {

	function IsHsl (o) {
		return o.h && o.s && o.l ? true : false
	}

	function IsRgb (o) {
		return o.r && o.g && o.b ? true : false
	}

	function Color (...args) {
		this.r = 0
		this.g = 0
		this.b = 0
		this.a = 255

		if (Type(args.first, 'string')) {
			let hex = args.shift().replace(/^#/, '')
			this.r = parseInt(hex.substr(0,2), 16)
			this.g = parseInt(hex.substr(2,2), 16)
			this.b = parseInt(hex.substr(4,2), 16)
			this.a = hex.length == 8 ? parseInt(hex.substr(6,2), 16) : 255
		} else if (Type(args.first, 'object')) {
			if (IsHsl(args.first)) {
				this.FromHSL(args.first)
			} else if (IsRgb(args.first)) {
				this.r = args.first.r
				this.g = args.first.g
				this.b = args.first.b
				this.a = args.first.a || 255
			}
		}

		Define(this, 'l', {
			get: () => {
				return rgbToHsl(this.r, this.g, this.b).l
			},
			set: (v) => {
				let hsl = rgbToHsl(this.r, this.g, this.b)
				hsl.l = v
				return this.FromHSL(hsl)
			}
		})

		return this
	}

	Define(Color, 'HexToRgba', (hex) => {
		hex = hex.replace(/^#/, '')
		return {
			r: parseInt(hex.substr(0,2), 16),
			g: parseInt(hex.substr(2,2), 16),
			b: parseInt(hex.substr(4,2), 16),
			a: hex.length == 8 ? parseInt(hex.substr(6,2), 16) : 255
		}
	})

	Define(Color, 'RgbaToHsl', (rgba) => {
		return rgbToHsl(rgba.r, rgba.g, rgba.b)
	})

	Define(Color, 'HslToHex', (hsl) => {
		return Color.RgbaToHex(Color.HslToRgba(hsl))
	})

	Define(Color, 'HslToRgba', (hsl) => {
		let rgba = hslToRgb(hsl.h, hsl.s, hsl.l)
		rgba.a = 255
		return rgba
	})

	Define(Color, 'RgbaToHex', (rgba) => {
		return '#'+toHex(Math.round(rgba.r))+toHex(Math.round(rgba.g))+toHex(Math.round(rgba.b))+toHex(Math.round(rgba.a || 255))
	})

	Color.prototype.FromHSL = function (hsl) {
		Extend(this, hslToRgb(hsl.h, hsl.s, hsl.l))
		return this
	}

	Color.prototype.Round = function () {
		this.r = Math.round(this.r)
		this.g = Math.round(this.g)
		this.b = Math.round(this.b)
		this.a = Math.round(this.a)
	}

	Color.prototype.AsHex = function () {
		this.Round()
		return '#'+toHex(this.r)+toHex(this.g)+toHex(this.b)+toHex(this.a)
	}

	Color.prototype.AsHSL = function () {
		return rgbToHsl(this.r, this.g, this.b)
	}

	Color.prototype.Lighten = function (n) {
		let hsl = rgbToHsl(this.r, this.g, this.b)
		hsl.l += n/100
		return new Color(hsl)
	}

	Color.prototype.Palette = function (n = 10) {
		let hsl = rgbToHsl(this.r, this.g, this.b)
		let palette = []

		hsl.l = 1.0
		while (hsl.l >= 0) {
			palette.push(Color.HslToHex(hsl))
			hsl.l -= n/100
		}
		return palette
	}


	return Color


	function toColorObject(c){var x,y,typ,arrlength,i,opacity,match,a,hue,sat,rgb,arr=[],colornames=[],colorhexs=[];x=(c=w3trim(c.toLowerCase())).substr(0,1).toUpperCase();y=c.substr(1);a=1;'R'!=x&&'Y'!=x&&'G'!=x&&'C'!=x&&'B'!=x&&'M'!=x&&'W'!=x||isNaN(y)||6==c.length&&-1==c.indexOf(',')||(c='ncol('+c+')');3==c.length||6==c.length||isNaN(c)||(c='ncol('+c+')');c.indexOf(',')>0&&-1==c.indexOf('(')&&(c='ncol('+c+')');if('rgb'==c.substr(0,3)||'hsl'==c.substr(0,3)||'hwb'==c.substr(0,3)||'ncol'==c.substr(0,4)||'cmyk'==c.substr(0,4)){if('ncol'==c.substr(0,4)){4==c.split(',').length&&-1==c.indexOf('ncola')&&(c=c.replace('ncol','ncola'));typ='ncol';c=c.substr(4)}else if('cmyk'==c.substr(0,4)){typ='cmyk';c=c.substr(4)}else{typ=c.substr(0,3);c=c.substr(3)}arrlength=3;opacity=false;if('a'==c.substr(0,1).toLowerCase()){arrlength=4;opacity=true;c=c.substr(1)}else if('cmyk'==typ){arrlength=4;if(5==c.split(',').length){arrlength=5;opacity=true}}arr=(c=(c=c.replace('(','')).replace(')','')).split(',');if('rgb'==typ){if(arr.length!=arrlength)return emptyObject();for(i=0;i<arrlength;i++){''!=arr[i]&&' '!=arr[i]||(arr[i]='0');if(arr[i].indexOf('%')>-1){arr[i]=arr[i].replace('%','');arr[i]=Number(arr[i]/100);i<3&&(arr[i]=Math.round(255*arr[i]))}if(isNaN(arr[i]))return emptyObject();parseInt(arr[i])>255&&(arr[i]=255);i<3&&(arr[i]=parseInt(arr[i]));3==i&&Number(arr[i])>1&&(arr[i]=1)}rgb={r:arr[0],g:arr[1],b:arr[2]};true==opacity&&(a=Number(arr[3]))}if('hsl'==typ||'hwb'==typ||'ncol'==typ){while(arr.length<arrlength)arr.push('0');'hsl'!=typ&&'hwb'!=typ||parseInt(arr[0])>=360&&(arr[0]=0);for(i=1;i<arrlength;i++){if(arr[i].indexOf('%')>-1){arr[i]=arr[i].replace('%','');arr[i]=Number(arr[i]);if(isNaN(arr[i]))return emptyObject();arr[i]=arr[i]/100}else arr[i]=Number(arr[i]);Number(arr[i])>1&&(arr[i]=1);Number(arr[i])<0&&(arr[i]=0)}if('hsl'==typ){rgb=hslToRgb(arr[0],arr[1],arr[2]);hue=Number(arr[0]);sat=Number(arr[1])}'hwb'==typ&&(rgb=hwbToRgb(arr[0],arr[1],arr[2]));'ncol'==typ&&(rgb=ncolToRgb(arr[0],arr[1],arr[2]));true==opacity&&(a=Number(arr[3]))}if('cmyk'==typ){while(arr.length<arrlength)arr.push('0');for(i=0;i<arrlength;i++){if(arr[i].indexOf('%')>-1){arr[i]=arr[i].replace('%','');arr[i]=Number(arr[i]);if(isNaN(arr[i]))return emptyObject();arr[i]=arr[i]/100}else arr[i]=Number(arr[i]);Number(arr[i])>1&&(arr[i]=1);Number(arr[i])<0&&(arr[i]=0)}rgb=cmykToRgb(arr[0],arr[1],arr[2],arr[3]);true==opacity&&(a=Number(arr[4]))}}else if('ncs'==c.substr(0,3))rgb=ncsToRgb(c);else{match=false;colornames=getColorArr('names');for(i=0;i<colornames.length;i++)if(c.toLowerCase()==colornames[i].toLowerCase()){colorhexs=getColorArr('hexs');match=true;rgb={r:parseInt(colorhexs[i].substr(0,2),16),g:parseInt(colorhexs[i].substr(2,2),16),b:parseInt(colorhexs[i].substr(4,2),16)};break}if(false==match){3==(c=c.replace('#','')).length&&(c=c.substr(0,1)+c.substr(0,1)+c.substr(1,1)+c.substr(1,1)+c.substr(2,1)+c.substr(2,1));for(i=0;i<c.length;i++)if(!isHex(c.substr(i,1)))return emptyObject();arr[0]=parseInt(c.substr(0,2),16);arr[1]=parseInt(c.substr(2,2),16);arr[2]=parseInt(c.substr(4,2),16);for(i=0;i<3;i++)if(isNaN(arr[i]))return emptyObject();rgb={r:arr[0],g:arr[1],b:arr[2]}}}return colorObject(rgb,a,hue,sat)}
	function colorObject(rgb, a, h, s) {
    var hsl, hwb, cmyk, ncol, color, hue, sat;
    if (!rgb) {
        return emptyObject();
    }
    null === a && (a = 1);
    hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    hwb = rgbToHwb(rgb.r, rgb.g, rgb.b);
    cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
    hue = h || hsl.h;
    sat = s || hsl.s;
    ncol = hueToNcol(hue);
    color = {
        red: rgb.r,
        green: rgb.g,
        blue: rgb.b,
        hue: hue,
        sat: sat,
        lightness: hsl.l,
        whiteness: hwb.w,
        blackness: hwb.b,
        cyan: cmyk.c,
        magenta: cmyk.m,
        yellow: cmyk.y,
        black: cmyk.k,
        ncol: ncol,
        opacity: a,
        valid: true
    };
    return color = roundDecimals(color);
}
function emptyObject(){return{red:0,green:0,blue:0,hue:0,sat:0,lightness:0,whiteness:0,blackness:0,cyan:0,magenta:0,yellow:0,black:0,ncol:'R',opacity:1,valid:false}}
	function getColorArr(x){return'names'==x?['AliceBlue','AntiqueWhite','Aqua','Aquamarine','Azure','Beige','Bisque','Black','BlanchedAlmond','Blue','BlueViolet','Brown','BurlyWood','CadetBlue','Chartreuse','Chocolate','Coral','CornflowerBlue','Cornsilk','Crimson','Cyan','DarkBlue','DarkCyan','DarkGoldenRod','DarkGray','DarkGrey','DarkGreen','DarkKhaki','DarkMagenta','DarkOliveGreen','DarkOrange','DarkOrchid','DarkRed','DarkSalmon','DarkSeaGreen','DarkSlateBlue','DarkSlateGray','DarkSlateGrey','DarkTurquoise','DarkViolet','DeepPink','DeepSkyBlue','DimGray','DimGrey','DodgerBlue','FireBrick','FloralWhite','ForestGreen','Fuchsia','Gainsboro','GhostWhite','Gold','GoldenRod','Gray','Grey','Green','GreenYellow','HoneyDew','HotPink','IndianRed','Indigo','Ivory','Khaki','Lavender','LavenderBlush','LawnGreen','LemonChiffon','LightBlue','LightCoral','LightCyan','LightGoldenRodYellow','LightGray','LightGrey','LightGreen','LightPink','LightSalmon','LightSeaGreen','LightSkyBlue','LightSlateGray','LightSlateGrey','LightSteelBlue','LightYellow','Lime','LimeGreen','Linen','Magenta','Maroon','MediumAquaMarine','MediumBlue','MediumOrchid','MediumPurple','MediumSeaGreen','MediumSlateBlue','MediumSpringGreen','MediumTurquoise','MediumVioletRed','MidnightBlue','MintCream','MistyRose','Moccasin','NavajoWhite','Navy','OldLace','Olive','OliveDrab','Orange','OrangeRed','Orchid','PaleGoldenRod','PaleGreen','PaleTurquoise','PaleVioletRed','PapayaWhip','PeachPuff','Peru','Pink','Plum','PowderBlue','Purple','RebeccaPurple','Red','RosyBrown','RoyalBlue','SaddleBrown','Salmon','SandyBrown','SeaGreen','SeaShell','Sienna','Silver','SkyBlue','SlateBlue','SlateGray','SlateGrey','Snow','SpringGreen','SteelBlue','Tan','Teal','Thistle','Tomato','Turquoise','Violet','Wheat','White','WhiteSmoke','Yellow','YellowGreen']:'hexs'==x?['f0f8ff','faebd7','00ffff','7fffd4','f0ffff','f5f5dc','ffe4c4','000000','ffebcd','0000ff','8a2be2','a52a2a','deb887','5f9ea0','7fff00','d2691e','ff7f50','6495ed','fff8dc','dc143c','00ffff','00008b','008b8b','b8860b','a9a9a9','a9a9a9','006400','bdb76b','8b008b','556b2f','ff8c00','9932cc','8b0000','e9967a','8fbc8f','483d8b','2f4f4f','2f4f4f','00ced1','9400d3','ff1493','00bfff','696969','696969','1e90ff','b22222','fffaf0','228b22','ff00ff','dcdcdc','f8f8ff','ffd700','daa520','808080','808080','008000','adff2f','f0fff0','ff69b4','cd5c5c','4b0082','fffff0','f0e68c','e6e6fa','fff0f5','7cfc00','fffacd','add8e6','f08080','e0ffff','fafad2','d3d3d3','d3d3d3','90ee90','ffb6c1','ffa07a','20b2aa','87cefa','778899','778899','b0c4de','ffffe0','00ff00','32cd32','faf0e6','ff00ff','800000','66cdaa','0000cd','ba55d3','9370db','3cb371','7b68ee','00fa9a','48d1cc','c71585','191970','f5fffa','ffe4e1','ffe4b5','ffdead','000080','fdf5e6','808000','6b8e23','ffa500','ff4500','da70d6','eee8aa','98fb98','afeeee','db7093','ffefd5','ffdab9','cd853f','ffc0cb','dda0dd','b0e0e6','800080','663399','ff0000','bc8f8f','4169e1','8b4513','fa8072','f4a460','2e8b57','fff5ee','a0522d','c0c0c0','87ceeb','6a5acd','708090','708090','fffafa','00ff7f','4682b4','d2b48c','008080','d8bfd8','ff6347','40e0d0','ee82ee','f5deb3','ffffff','f5f5f5','ffff00','9acd32']:void 0}
	function roundDecimals(c){c.red=Number(c.red.toFixed(0));c.green=Number(c.green.toFixed(0));c.blue=Number(c.blue.toFixed(0));c.hue=Number(c.hue.toFixed(0));c.sat=Number(c.sat.toFixed(2));c.lightness=Number(c.lightness.toFixed(2));c.whiteness=Number(c.whiteness.toFixed(2));c.blackness=Number(c.blackness.toFixed(2));c.cyan=Number(c.cyan.toFixed(2));c.magenta=Number(c.magenta.toFixed(2));c.yellow=Number(c.yellow.toFixed(2));c.black=Number(c.black.toFixed(2));c.ncol=c.ncol.substr(0,1)+Math.round(Number(c.ncol.substr(1)));c.opacity=Number(c.opacity.toFixed(2));return c}
	function hslToRgb(hue,sat,light){var t1,t2;hue/=60;t1=2*light-(t2=light<=.5?light*(sat+1):light+sat-light*sat);return{r:255*hueToRgb(t1,t2,hue+2),g:255*hueToRgb(t1,t2,hue),b:255*hueToRgb(t1,t2,hue-2)}}
	function hueToRgb(t1,t2,hue){hue<0&&(hue+=6);hue>=6&&(hue-=6);return hue<1?(t2-t1)*hue+t1:hue<3?t2:hue<4?(t2-t1)*(4-hue)+t1:t1}
	function hwbToRgb(hue,white,black){var i,rgb,tot,rgbArr=[];rgb=hslToRgb(hue,1,.5);rgbArr[0]=rgb.r/255;rgbArr[1]=rgb.g/255;rgbArr[2]=rgb.b/255;if((tot=white+black)>1){white=Number((white/tot).toFixed(2));black=Number((black/tot).toFixed(2))}for(i=0;i<3;i++){rgbArr[i]*=1-white-black;rgbArr[i]+=white;rgbArr[i]=Number(255*rgbArr[i])}return{r:rgbArr[0],g:rgbArr[1],b:rgbArr[2]}}
	function cmykToRgb(c,m,y,k){return{r:255-255*Math.min(1,c*(1-k)+k),g:255-255*Math.min(1,m*(1-k)+k),b:255-255*Math.min(1,y*(1-k)+k)}}
	function ncolToRgb(ncol,white,black){var letter,percent,h;h=ncol;if(isNaN(ncol.substr(0,1))){letter=ncol.substr(0,1).toUpperCase();''==(percent=ncol.substr(1))&&(percent=0);percent=Number(percent);if(isNaN(percent))return false;'R'==letter&&(h=0+.6*percent);'Y'==letter&&(h=60+.6*percent);'G'==letter&&(h=120+.6*percent);'C'==letter&&(h=180+.6*percent);'B'==letter&&(h=240+.6*percent);'M'==letter&&(h=300+.6*percent);if('W'==letter){h=0;white=1-percent/100;black=percent/100}}return hwbToRgb(h,white,black)}
	function hueToNcol(hue){while(hue>=360)hue-=360;return hue<60?'R'+hue/.6:hue<120?'Y'+(hue-60)/.6:hue<180?'G'+(hue-120)/.6:hue<240?'C'+(hue-180)/.6:hue<300?'B'+(hue-240)/.6:hue<360?'M'+(hue-300)/.6:void 0}
	function ncsToRgb(ncs){var black,chroma,bc,percent,black1,chroma1,factor1,blue1,red1,red2,green2,blue2,factor2,grey,r,g,b;-1==(ncs=(ncs=(ncs=(ncs=(ncs=w3trim(ncs).toUpperCase()).replace('(','')).replace(')','')).replace('NCS','NCS ')).replace(/  /g,' ')).indexOf('NCS')&&(ncs='NCS '+ncs);if(null===(ncs=ncs.match(/^(?:NCS|NCS\sS)\s(\d{2})(\d{2})-(N|[A-Z])(\d{2})?([A-Z])?$/)))return false;black=parseInt(ncs[1],10);chroma=parseInt(ncs[2],10);if('N'!=(bc=ncs[3])&&'Y'!=bc&&'R'!=bc&&'B'!=bc&&'G'!=bc)return false;percent=parseInt(ncs[4],10)||0;if('N'!==bc){black1=1.05*black-5.25;chroma1=chroma;if('Y'===bc&&percent<=60)red1=1;else if('Y'===bc&&percent>60||'R'===bc&&percent<=80){factor1='Y'===bc?percent-60:percent+40;red1=(Math.sqrt(14884-Math.pow(factor1,2))-22)/100}else if('R'===bc&&percent>80||'B'===bc)red1=0;else if('G'===bc){factor1=percent-170;red1=(Math.sqrt(33800-Math.pow(factor1,2))-70)/100}if('Y'===bc&&percent<=80)blue1=0;else if('Y'===bc&&percent>80||'R'===bc&&percent<=60){factor1='Y'===bc?percent-80+20.5:percent+20+20.5;blue1=(104-Math.sqrt(11236-Math.pow(factor1,2)))/100}else if('R'===bc&&percent>60||'B'===bc&&percent<=80){factor1='R'===bc?percent-60-60:percent+40-60;blue1=(Math.sqrt(1e4-Math.pow(factor1,2))-10)/100}else if('B'===bc&&percent>80||'G'===bc&&percent<=40){factor1='B'===bc?percent-80-131:percent+20-131;blue1=(122-Math.sqrt(19881-Math.pow(factor1,2)))/100}else'G'===bc&&percent>40&&(blue1=0);if('Y'===bc)green1=(85-.85*percent)/100;else if('R'===bc&&percent<=60)green1=0;else if('R'===bc&&percent>60){factor1=percent-60+35;green1=(67.5-Math.sqrt(5776-Math.pow(factor1,2)))/100}else if('B'===bc&&percent<=60){factor1=1*percent-68.5;green1=(6.5+Math.sqrt(7044.5-Math.pow(factor1,2)))/100}else if('B'===bc&&percent>60||'G'===bc&&percent<=60)green1=.9;else if('G'===bc&&percent>60){factor1=percent-60;green1=(90-1/8*factor1)/100}red2=((factor1=(red1+green1+blue1)/3)-red1)*(100-chroma1)/100+red1;green2=(factor1-green1)*(100-chroma1)/100+green1;blue2=(factor1-blue1)*(100-chroma1)/100+blue1;factor2=1/(red2>green2&&red2>blue2?red2:green2>red2&&green2>blue2?green2:blue2>red2&&blue2>green2?blue2:(red2+green2+blue2)/3);r=parseInt(red2*factor2*(100-black1)/100*255,10);g=parseInt(green2*factor2*(100-black1)/100*255,10);b=parseInt(blue2*factor2*(100-black1)/100*255,10);r>255&&(r=255);g>255&&(g=255);b>255&&(b=255);r<0&&(r=0);g<0&&(g=0);b<0&&(b=0)}else{(grey=parseInt(255*(1-black/100),10))>255&&(grey=255);grey<0&&(grey=0);r=grey;g=grey;b=grey}return{r:r,g:g,b:b}}
	function rgbToHsl(r,g,b){var min,max,i,l,maxcolor,h,rgb=[];rgb[0]=r/255;rgb[1]=g/255;rgb[2]=b/255;min=rgb[0];max=rgb[0];maxcolor=0;for(i=0;i<rgb.length-1;i++){rgb[i+1]<=min&&(min=rgb[i+1]);if(rgb[i+1]>=max){max=rgb[i+1];maxcolor=i+1}}0==maxcolor&&(h=(rgb[1]-rgb[2])/(max-min));1==maxcolor&&(h=2+(rgb[2]-rgb[0])/(max-min));2==maxcolor&&(h=4+(rgb[0]-rgb[1])/(max-min));isNaN(h)&&(h=0);(h*=60)<0&&(h+=360);l=(min+max)/2;return{h:h,s:min==max?0:l<.5?(max-min)/(max+min):(max-min)/(2-max-min),l:l}}
	function rgbToHwb(r,g,b){r/=255;g/=255;b/=255;max=Math.max(r,g,b);min=Math.min(r,g,b);chroma=max-min;return{h:0==chroma?0:r==max?(g-b)/chroma%6*360:g==max?((b-r)/chroma+2)%6*360:((r-g)/chroma+4)%6*360,w:min,b:1-max}}
	function rgbToCmyk(r,g,b){var c,m,y,k;r/=255;g/=255;b/=255;max=Math.max(r,g,b);if(1==(k=1-max)){c=0;m=0;y=0}else{c=(1-r-k)/(1-k);m=(1-g-k)/(1-k);y=(1-b-k)/(1-k)}return{c:c,m:m,y:y,k:k}}
	function toHex(n){var hex=n.toString(16);while(hex.length<2)hex='0'+hex;return hex}
	function cl(x){console.log(x)}
	function w3trim(x){return x.replace(/^\s+|\s+$/g,'')}
	function isHex(x){return'0123456789ABCDEFabcdef'.indexOf(x)>-1}
	window.w3color = w3color;


}))