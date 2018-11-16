(function (window) {
	'use strict';

	function Template() {
		this.defaultTemplate
		=	'<li id="{{id}}">'
        +		'<span>{{time}} </span>'
        +		'<span>{{message}} </span>'
        +		'<input type=button name=snooze value="끄기" style="color:{{buttonColor}};">'
        +       '<input type=button name=delete value="삭제">'
		+	'</li>';
	}

	Template.prototype.show = function (data) {
        var view = '',
            i, l, time, h, m, color, template;

		for (i = 0, l = data.length; i < l; i++) {
			template = this.defaultTemplate;
            time = data[i].time;
            h = Math.floor(time / 3600);
            m = Math.floor((time % 3600) / 60);
            time = (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m;
            color = data[i].snooze ? "green" : "";

			template = template.replace('{{id}}', data[i].id);
            template = template.replace('{{time}}', time);
            template = template.replace('{{message}}', data[i].msg);
            template = template.replace('{{buttonColor}}', color);

			view = view + template;
		}

		return view;
	};

	// Export to window
	window.app = window.app || {};
	window.app.Template = Template;
})(window);