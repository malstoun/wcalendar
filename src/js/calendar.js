var months = {
	0: ['январь', 'янв', 'января'],
	1: ['февраль', 'фев', 'февраля'],
	2: ['март', 'мар', 'марта'],
	3: ['апрель', 'апр', 'апреля'],
	4: ['май', 'май', 'мая'],
	5: ['июнь', 'июн', 'июня'],
	6: ['июль', 'июл', 'июля'],
	7: ['август', 'авг', 'августа'],
	8: ['сентябрь', 'сен', 'сентября'],
	9: ['октябрь', 'окт', 'октября'],
	10: ['ноябрь', 'ноя', 'ноября'],
	11: ['декабрь', 'дек', 'декабря']
};

var daysInMonth = {
	0: 31,
	1: 28,
	2: 31,
	3: 30,
	4: 31,
	5: 30,
	6: 31,
	7: 31,
	8: 30,
	9: 31,
	10: 30,
	11: 31
};

var daysName = {
	0: ['понедельник', 'Пн'],
	1: ['вторник', 'Вт'],
	2: ['среда', 'Ср'],
	3: ['четверг', 'Чт'],
	4: ['пятница', 'Пт'],
	5: ['суббота', 'Сб'],
	6: ['воскресенье', 'Вс']
};

HtmlGenerator = function (calendar) {
	this.calendar = calendar;
};

HtmlGenerator.prototype = {

	// Section with classes
	// If you want use your own classes for elements just replace class here

	DAYS_OF_WEEK:	'weekday', // Day of the week
	ARROW_LEFT_CLASS:	'move-left', // Arrow to change the date (left)
	ARROW_RIGHT_CLASS:	'move-right', // Arrow to change the date (right)
	SELECTED_DATE_CLASS_DAY:	'selected-date', // Selected date in Day screen (23 apr 2013)
	SELECTED_DATE_CLASS_MONTH:	'selected-date', // Selected date in Month screen (apr 2013)
	SELECTED_DATE_CLASS_YEAR:	'selected-date', // Selected date in Year screen (2013)
	SELECTED_DATE_CLASS_DECS:	'selected-date', // Selected date in Decs screen (2000-2099)
	ANOTHER_DAY:	'day-another', // Day of another month
	ANOTHER_YEAR:	'year-another', // Year of another decs
	ANOTHER_DECS:	'decs-another', // Decs of another cent
	DAY_ITEM:	'day item', // Day on the calendar
	MONTH_ITEM:	'month item', // Month on the calendar
	YEAR_ITEM:	'year item', // Year on the calendar
	DECS_ITEM:	'decs item', // Decs on the calendar

	getHead: function (params) {
		var selectedDate = $('<div />', {
			class: 'wrap-selected-date'
		});

		selectedDate.append($('<div />', {
			text: '<',
			class: this.ARROW_LEFT_CLASS
		}));

		switch (params.type) {
			case 'day': selectedDate.append($('<div />', {
				class: this.SELECTED_DATE_CLASS_DAY,
				text: params.date.getDate() + ' ' +
				months[params.date.getMonth()][2] + ' ' +
				params.date.getFullYear()
			})); break;

			case 'month': selectedDate.append($('<div />', {
				class: this.SELECTED_DATE_CLASS_MONTH,
				text: (months[params.date.getMonth()][0]) + ' ' +
				params.date.getFullYear()
			})); break;

			case 'year': selectedDate.append($('<div />', {
				class: this.SELECTED_DATE_CLASS_YEAR,
				text: params.date.getFullYear()
			})); break;

			case 'decs': selectedDate.append($('<div />', {
				class: this.SELECTED_DATE_CLASS_DECS,
				text: parseInt(params.date.getFullYear() / 100) * 100 + '-' + (parseInt(params.date.getFullYear() / 100) * 100 + 99)
			})); break;
		}

		selectedDate.append($('<div />', {
			text: '>',
			class: this.ARROW_RIGHT_CLASS
		}));

		return selectedDate;
	},

	isCorrect: function (param) {
		if (param.day !== undefined) {
			var d = new Date(this.calendar.dateCurrent.getFullYear(),
				this.calendar.dateCurrent.getMonth(), param.day);
			if (d < this.calendar.dateFrom || d > this.calendar.dateTo)
				return false;
			else
				return true;
		}

		if (param.month !== undefined) {
			var dF = new Date(this.calendar.dateCurrent.getFullYear(),
				param.month, daysInMonth[param.month]);
			var dT = new Date(this.calendar.dateCurrent.getFullYear(),
				param.month, 1);
			if (dF < this.calendar.dateFrom || dT > this.calendar.dateTo)
				return false;
			else
				return true;
		}

		if (param.year !== undefined) {
			if (param.year < this.calendar.dateFrom.getFullYear() ||
				param.year > this.calendar.dateTo.getFullYear())
				return false;
			else
				return true;
		}

		if (param.decs !== undefined) {
			if ((param.decs + 9) < this.calendar.dateFrom.getFullYear() ||
				param.decs > this.calendar.dateTo.getFullYear())
				return false;
			else
				return true;
		}
	},

	getDays: function () {
		var date = this.calendar.dateCurrent;
		var html = $('<div />');

		var selectedDate = this.getHead( { type: 'day', date: date } );

		html.append(selectedDate);

		var dayName = $('<div />', {
			class: 'wrap-weekdays'
		});

		for (var i = 0; i < 7; i++) {
			dayName.append($('<div />', {
				class: this.DAYS_OF_WEEK,
				text: daysName[i][1]
			}));
		}

		html.append(dayName);

		html.append($('<hr />', {
			class: 'line'
		}));

		// Выбираем текущий месяц, берём первое число и узнаём день недели
		var firstDay = new Date(date.getFullYear(),
			date.getMonth(),
			1);
		var dayCode = firstDay.getDay();

		/* У нас воскресенье 7 день недели */
		if (dayCode == 0)
			dayCode = 7;

		var wrap = $('<div />', {
			class: 'day-wrap'
		});

		if (dayCode == 1)
			dayCode = 8;

		for (var ii = 1; ii < dayCode; ii++)
			wrap.append($('<div />', {
				class: this.ANOTHER_DAY,
				text: (new Date(firstDay.getMilliseconds() - 86000000 * dayCode + (ii * 86000000))).getDate()
			}));

		var temp;
		var numberDays;

		if ((date.getFullYear() % 4 == 0) && (date.getFullYear() % 100 != 0) || (date.getFullYear() % 400 == 0)) {
			numberDays = daysInMonth[date.getMonth()] + 1;
		} else {
			numberDays = daysInMonth[date.getMonth()];
		}

		for (i = 1; i <= numberDays; i++) {
			temp = $('<div/>', {
				class: this.DAY_ITEM,
				'data-code': i,
				text: i
			});

			if (!this.isCorrect({ day: i }))
				temp.addClass('warning');

			if ((i == this.calendar.getDate().getDate()) && 
				this.calendar.selectedMonth == date.getMonth())
				temp.addClass('selected');

			wrap.append(temp);

			if ((i + ii - 1) % 7 == 0)
				wrap.append($('<br />'));
		}

		var anotherMonth = 1;

		i -= 2; // Корректировка

		// Добиваем до 42 дней, 6 строк
		while (i + ii != 42) {
			wrap.append($('<div />', {
				class: this.ANOTHER_DAY,
				text: anotherMonth++
			}));
			i++;
		}

		html.append(wrap);

		return html;
	},

	getMonths: function () {
		var date = this.calendar.dateCurrent;
		var html = $('<div />');
		var temp;

		var selectedDate = this.getHead( { type: 'month', date: date } );

		html.append(selectedDate);

		var wrap = $('<div />', {
			class: 'month-wrap'
		});

		for (var i = 0; i < 12; i++) {
			temp = $('<div />', {
				class: this.MONTH_ITEM,
				'data-code': i,
				text: months[i][1]
			});

			if (!this.isCorrect({ month: i }))
				temp.addClass('warning');

			if ((i == date.getMonth()) && date.getMonth() == this.calendar.selectedMonth)
				temp.addClass('selected');

			wrap.append(temp);

			if ((i + 1) % 4 == 0)
				wrap.append($('<br />'));
		}

		html.append(wrap);

		return html;

	},

	getYears: function () {
		var date = this.calendar.dateCurrent;
		var html = $('<div />');
		var temp;
		var count = 0; // Счётчик годов в строке

		var selectedDate = this.getHead( { type: 'year', date: date } );

		html.append(selectedDate);

		var wrap = $('<div />', {
			class: 'year-wrap'
		});

		wrap.append($('<div />', {
			class: this.ANOTHER_YEAR,
			text: parseInt(date.getFullYear() / 10, 10) * 10 - 1
		}));

		count++;

		for (var i = parseInt(date.getFullYear() / 10, 10) * 10; i < parseInt(date.getFullYear() / 10, 10) * 10 + 10; i++) {
			count++;
			temp = $('<div />', {
				class: this.YEAR_ITEM,
				'data-code': i,
				text: i
			});

			if (!this.isCorrect({ year: i }))
				temp.addClass('warning');

			if ((i == date.getFullYear()) && date.getFullYear() == this.calendar.selectedYear)
				temp.addClass('selected');

			wrap.append(temp);

			if (count % 4 == 0)
				wrap.append($('<br />'));
		}

		wrap.append($('<div />', {
			class: this.ANOTHER_YEAR,
			text: parseInt(date.getFullYear() / 10, 10) * 10 + 10
		}));

		html.append(wrap);

		return html;
	},

	getDecs: function () {
		var date = this.calendar.dateCurrent;
		var html = $('<div />');
		var temp;
		var count = 0; // Счётчик годов в строке

		var selectedDate = this.getHead( { type: 'decs', date: date } );

		html.append(selectedDate);

		var wrap = $('<div />', {
			class: 'decs-wrap'
		});

		wrap.append($('<div />', {
			class: this.ANOTHER_DECS,
			text: parseInt(date.getFullYear() / 100, 10) * 100 - 10 + '-' + (parseInt(date.getFullYear() / 100, 10) * 100 - 1)
		}));

		count++;

		for (var i = parseInt(date.getFullYear() / 100, 10) * 100; i < parseInt(date.getFullYear() / 100, 10) * 100 + 100; i += 10) {
			count++;
			temp = $('<div />', {
				class: this.DECS_ITEM,
				'data-code': i,
				text: i + '-' + (i+9)
			});

			if (!this.isCorrect({ decs: i }))
				temp.addClass('warning');

			if ((i == date.getFullYear()) && date.getFullYear() == this.calendar.selectedYear)
				temp.addClass('selected');

			wrap.append(temp);

			if (count % 4 == 0)
				wrap.append($('<br />'));
			}

		wrap.append($('<div />', {
			class: this.ANOTHER_DECS,
			text: parseInt(date.getFullYear() / 100, 10) * 100 + 100 + '-' + (parseInt(date.getFullYear() / 100, 10) * 100 + 119)
		}));

		html.append(wrap);

		return html;
	}
};

Calendar = function (object) {
	this.object = object;
	this.input = object._calendar;
	this.dateFrom = new Date(1920, 0, 3);
	this.dateTo = new Date(2030, 11, 1);
	this.dateCurrent = new Date();
	this.htmlGenerator = new HtmlGenerator(this);
	this.levelCode = 0;
	this.levels = {0: 'days', 1: 'months', 2: 'years', 3: 'decs' };
	this.selectedDay = this.dateCurrent.getDate();
	this.selectedMonth = this.dateCurrent.getMonth();
	this.selectedYear = this.dateCurrent.getFullYear();
	this.previousSelected = undefined;

	this.initBinds();
};

Calendar.prototype = {

	init: function (params) {
		if (typeof params == 'object') {
			if (params.from) {
				if (params.from instanceof Date) {
					this.dateFrom = params.from;
				} else {
					var dateFrom = params.from.split('.');
					this.dateFrom.setDate(parseInt(dateFrom[0], 10));
					this.dateFrom.setMonth(parseInt(dateFrom[1], 10) - 1);
					this.dateFrom.setYear(parseInt(dateFrom[2], 10));
				}
			}
			if (params.to) {
				if (params.to instanceof Date) {
					this.dateTo = params.to;
				} else {
					var dateTo = params.to.split('.');
					this.dateTo.setDate(parseInt(dateTo[0], 10));
					this.dateTo.setMonth(parseInt(dateTo[1], 10) - 1);
					this.dateTo.setYear(parseInt(dateTo[2], 10));
				}
			}
			if (params.selected) {
				if (params.selected instanceof Date) {
					this.selectedDay = params.selected.getDate();
					this.selectedMonth = params.selected.getMonth();
					this.selectedYear = params.selected.getFullYear();
					this.dateCurrent = params.selected;
				} else {
					var dateSelected = params.selected.split('.');
					this.selectedDay = parseInt(dateSelected[0], 10);
					this.selectedMonth = parseInt(dateSelected[1], 10) - 1;
					this.selectedYear = parseInt(dateSelected[2], 10);
					this.dateCurrent.setDate(this.selectedDay);
					this.dateCurrent.setMonth(this.selectedMonth);
					this.dateCurrent.setYear(this.selectedYear);
				}
			}
		} else if (typeof params == 'string') {
			var dateSelected = params.selected.split('.');
			this.selectedDay = parseInt(dateSelected[0], 10);
			this.selectedMonth = parseInt(dateSelected[1], 10) - 1;
			this.selectedYear = parseInt(dateSelected[2], 10);
			this.dateCurrent.setDate(this.selectedDay);
			this.dateCurrent.setMonth(this.selectedMonth);
			this.dateCurrent.setYear(this.selectedYear);
		} else {
			return;
		}
	},

	getDate: function () {
		var selectedDate;
		selectedDate = new Date(this.selectedYear, this.selectedMonth, this.selectedDay);
		return selectedDate;
	},

	setDate: function (date) {
		if (date instanceof Date) {
			this.selectedDay = date.getDate();
			this.selectedMonth = date.getMonth();
			this.selectedYear = date.getFullYear();
		} else if (typeof date == 'string') {
			var date = date.split('.');
			this.selectedDay = parseInt(date[0], 10);
			this.selectedMonth = parseInt(date[1], 10) - 1;
			this.selectedYear = parseInt(date[2], 10);
		}
		$(this.input).html(this.getHtml());
	},

	getHtml: function () {
		var html;

		if (arguments.length != 0)
		{
			switch (arguments[0]) {
				case 'days': 
					html = this.htmlGenerator.getDays();
					if (arguments[1] == 'down')
						$('.calendar').animate({
							height: '+=40px'
						}, 100);
					break;
				case 'months': 
					html = this.htmlGenerator.getMonths();
					if (arguments[1] == 'up')
						$('.calendar').animate({
							height: '-=40px'
						}, 100);
					break;
				case 'years': html = this.htmlGenerator.getYears(); break;
				case 'decs': html = this.htmlGenerator.getDecs(); break;
			}
		} else {
			html = this.htmlGenerator.getDays();
		}

		return html;
	},

	moveUp: function () {
		if (this.levelCode < 3) // если decs, то 3
			this.levelCode++;
		this.previousSelected = undefined;
		$(this.input).html(this.getHtml(this.levels[this.levelCode], 'up').html());
	},

	moveDown: function () {
		if (this.levelCode > 0)
			this.levelCode--;
		this.previousSelected = undefined;
		$(this.input).html(this.getHtml(this.levels[this.levelCode], 'down').html());
	},

	moveLeft: function () {
		switch (this.levelCode) {
			case 0: 
				if ((this.dateCurrent.getMonth() - 1) != -1) {
					this.dateCurrent.setMonth(this.dateCurrent.getMonth() - 1)
				} else {
					this.dateCurrent.setYear(this.dateCurrent.getFullYear() - 1);
					this.dateCurrent.setMonth(11);
				}
				break;

			case 1: 
				if ((this.dateCurrent.getFullYear() - 1) > this.dateFrom.getFullYear()) {
					this.dateCurrent.setYear(this.dateCurrent.getFullYear() - 1);
				}
				break;

			case 2:
				if ((parseInt((this.dateCurrent.getFullYear() - 10) / 10, 10)) >= parseInt(this.dateFrom.getFullYear() / 10, 10)) {
					this.dateCurrent.setYear(this.dateCurrent.getFullYear() - 10);
				}
				break;

			case 3:
				if ((parseInt((this.dateCurrent.getFullYear() - 100) / 100, 10)) >= 19) {
					this.dateCurrent.setYear(this.dateCurrent.getFullYear() - 100);
				}
				break;
		}
		$(this.input).html(this.getHtml(this.levels[this.levelCode]));
	},

	moveRight: function () {
		switch (this.levelCode) {
			case 0: 
				if ((this.dateCurrent.getMonth() + 1) != 12) {
					this.dateCurrent.setMonth(this.dateCurrent.getMonth() + 1);
				} else {
					this.dateCurrent.setYear(this.dateCurrent.getFullYear() + 1);
					this.dateCurrent.setMonth(0);
				}
				break;

			case 1: 
				if ((this.dateCurrent.getFullYear() + 1) < this.dateTo.getFullYear()) {
					this.dateCurrent.setYear(this.dateCurrent.getFullYear() + 1);
				}
				break;

			case 2:
				if ((parseInt((this.dateCurrent.getFullYear() + 10) / 10, 10)) <= parseInt(this.dateTo.getFullYear() / 10, 10)) {
					this.dateCurrent.setYear(this.dateCurrent.getFullYear() + 10);
				}
				break;

			case 3:
				if (parseInt((this.dateCurrent.getFullYear() + 100) / 100, 10) <= 20) {
					this.dateCurrent.setYear(this.dateCurrent.getFullYear() + 100);
				}
				break;
		}
		$(this.input).html(this.getHtml(this.levels[this.levelCode]));
	},

	initBinds: function () {
		var self = this;
		$(this.input).on('mouseenter', '.item', function (event) {
			$(this).addClass('hover');
		}).on('mouseleave', '.item', function (event) {
			$(this).removeClass('hover');
		}).on('click', '.item', function () {
			if (self.previousSelected)
				self.previousSelected.removeClass('selected');
			else
				$('.selected').removeClass('selected');
			$(this).addClass('selected');
			if ($(this).hasClass('month')) {
				self.selectedMonth = parseInt($(this).attr('data-code'), 10);
				self.dateCurrent.setMonth(parseInt($(this).attr('data-code'), 10));
			}
			else if ($(this).hasClass('year')) {
				self.selectedYear = parseInt($(this).attr('data-code'), 10);
				self.dateCurrent.setYear(parseInt($(this).attr('data-code'), 10));
			}
			else if ($(this).hasClass('decs')) {
				self.selectedYear = parseInt($(this).attr('data-code'), 10);
				self.dateCurrent.setYear(parseInt($(this).attr('data-code'), 10));
			}
			if ($(this).hasClass('day')) {
				self.previousSelected = $(this);
				self.selectedYear = self.dateCurrent.getFullYear();
				self.selectedMonth = self.dateCurrent.getMonth();
				self.selectedDay = parseInt($(this).attr('data-code'), 10);
				self.dateCurrent.setDate(parseInt($(this).attr('data-code'), 10));
				self.fillSelect();
				$(self.input).hide();
			} else {
				self.moveDown();
			}
			event.stopPropagation();
		}).on('click', '.move-left', function () {
			self.moveLeft();
			event.stopPropagation();
		}).on('click', '.move-right', function () {
			self.moveRight();
			event.stopPropagation();
		});

		$(this.input).on('click', '.selected-date', function () {
			self.moveUp();
			event.stopPropagation();
		});
	},

	fillSelect: function () {
		this.object.setValue(this.getDate());
	}
};

$(document).ready(function () {
	var cal = null;
	$('.opener-calendar').on('click', function (event) {
		if (!$(".calendar").is(":visible")) {
			if (cal === null)
				cal = new Calendar({ _calendar: $(".calendar") });
			cal.init({
				from: '1.03.2013',
				to: '15.04.2013',
				selected: '10.10.2008'
			});
			$('.calendar').html(cal.getHtml().html())
						.fadeIn();
		} else {
			$('.calendar').hide();
		}
		event.stopPropagation();
	});

	$('body').click(function () {
		$('.calendar').hide();
	});
});