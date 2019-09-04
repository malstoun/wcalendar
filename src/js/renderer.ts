import { months, daysName, daysInMonth } from './config';

const styleConsts = {
  // Section with classes
  // If you want to use your own classes for elements just add your classes before standard class

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
  DAY_ITEM:	'day item', // Day on the calendar. item is REQUIRED
  MONTH_ITEM:	'month item', // Month on the calendar. item is REQUIRED
  YEAR_ITEM:	'year item', // Year on the calendar. item is REQUIRED
  DECS_ITEM:	'decs item', // Decs on the calendar. item is REQUIRED
  WARNING_CLASS: 'warning', // Class using for highlight invalide date or something error
  SELECTION_CLASS: 'selected', // Class using for highlight selected date
};

function div(className?: string): HTMLDivElement {
  const el = document.createElement('div');
  el.classList.add(className);
  return el;
}

interface headParams {
  type: string;
  date: any;
}

class Renderer {
  private calendar;

  constructor(calendar) {
    this.calendar = calendar;
  }

  getHead(params: headParams): HTMLElement {
    const selectedDate = div('wrap-selected-date');

    const leftArrow = div(styleConsts.ARROW_LEFT_CLASS);
    leftArrow.textContent = '<';
    selectedDate.appendChild(leftArrow);

    switch (params.type) {
      case 'day':
        const day = div(styleConsts.SELECTED_DATE_CLASS_DAY);
        day.textContent = `${params.date.getDate()} ${months[params.date.getMonth()][2]} ${params.date.getFullYear()}`;
        selectedDate.appendChild(day);
        break;

      case 'month':
        const month = div(styleConsts.SELECTED_DATE_CLASS_MONTH);
        month.textContent = `${months[params.date.getMonth()][0]} ${params.date.getFullYear()}`;
        selectedDate.appendChild(month);
        break;

      case 'year':
        const year = div(styleConsts.SELECTED_DATE_CLASS_YEAR);
        year.textContent = params.date.getFullYear();
        selectedDate.appendChild(year);
        break;

      case 'decs':
        const decs = div(styleConsts.SELECTED_DATE_CLASS_DECS);
        decs.textContent = `${Math.floor(params.date.getFullYear() / 100) * 100}-${Math.floor(params.date.getFullYear() / 100) * 100 + 99}`;
        selectedDate.appendChild(decs);
        break;
    }

    const rightArrow = div(styleConsts.ARROW_RIGHT_CLASS);
    rightArrow.textContent = '>';
    selectedDate.appendChild(rightArrow);

    return selectedDate;
  }

  getDays(): HTMLElement {
    const date = this.calendar.dateCurrent;
    const html = div();

    const selectedDate = this.getHead( { type: 'day', date: date } );

    html.appendChild(selectedDate);

    const dayName = div('wrap-weekdays');

    for (var i = 0; i < 7; i++) {
      const d = div(styleConsts.DAYS_OF_WEEK);
      d.textContent = daysName[i][1];
      dayName.appendChild(d);
    }

    html.appendChild(dayName);

    const hr = document.createElement('hr');
    hr.classList.add('line');
    html.appendChild(hr);

    // Выбираем текущий месяц, берём первое число и узнаём день недели
    const firstDay = new Date(date.getFullYear(),
        date.getMonth(),
        1);
    let dayCode = firstDay.getDay();

    /* У нас воскресенье 7 день недели */
    if (dayCode === 0) {
      dayCode = 7;
    }

    if (dayCode == 1) {
      dayCode = 8;
    }

    const wrap = div('day-wrap');

    // объявляем тут, потому что нам ниже понадобиться индекст, на котором мы закончили цикл
    let ii = 0;

    for (let ii = 1; ii < dayCode; ii++) {
      const d = div(styleConsts.ANOTHER_DAY);
      d.textContent = (new Date(firstDay.getMilliseconds() - 86000000 * dayCode + (ii * 86000000))).getDate().toString();
      wrap.appendChild(d);
    }

    let temp;
    let numberDays;

    if ((date.getFullYear() % 4 == 0) && (date.getFullYear() % 100 != 0) || (date.getFullYear() % 400 == 0)) {
      numberDays = daysInMonth[date.getMonth()] + 1;
    } else {
      numberDays = daysInMonth[date.getMonth()];
    }

    for (i = 1; i <= numberDays; i++) {
      const temp = div(styleConsts.DAY_ITEM);
      temp.textContent = i.toString();
      temp.dataset.code = i.toString();

      if (!this.calendar.isCorrect({ day: i })) {
        temp.classList.add(styleConsts.WARNING_CLASS);
      }

      if ((i == this.calendar.getDate().getDate()) &&
          this.calendar.selectedMonth == date.getMonth()) {
        temp.classList.add(styleConsts.SELECTION_CLASS);
      }

      wrap.appendChild(temp);

      if ((i + ii - 1) % 7 == 0) {
        const br = document.createElement('br');
        wrap.appendChild(br);
      }
    }

    let anotherMonth = 1;

    i -= 2; // Корректировка

    // Добиваем до 42 дней, 6 строк
    while (i + ii != 42) {
      const d = div(styleConsts.ANOTHER_DAY);
      // TODO: проблема с датами может быть тут
      // возможно надо сначала приводить к строке, а потом увеличивать на 1
      d.textContent = (anotherMonth++).toString();
      wrap.appendChild(d);
      i++;
    }

    html.appendChild(wrap);

    return html;
  }

  getMonths(): HTMLElement {
    const date = this.calendar.dateCurrent;
    const html = div();

    const selectedDate = this.getHead( { type: 'month', date: date } );

    html.appendChild(selectedDate);

    const wrap = div('month-wrap');

    for (let i = 0; i < 12; i++) {
      const temp = div(styleConsts.MONTH_ITEM);
      temp.dataset.code = i.toString();
      temp.textContent = months[i][1];

      if (!this.calendar.isCorrect({ month: i })) {
        temp.classList.add(styleConsts.WARNING_CLASS);
      }

      if ((i == date.getMonth()) && date.getMonth() == this.calendar.selectedMonth) {
        temp.classList.add(styleConsts.SELECTION_CLASS);
      }

      wrap.appendChild(temp);

      if ((i + 1) % 4 == 0) {
        wrap.appendChild(document.createElement('br'));
      }
    }

    html.appendChild(wrap);

    return html;
  }
}
