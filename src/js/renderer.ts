import { months } from './config';

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

function div(className: string): HTMLDivElement {
  const el = document.createElement('div');
  el.classList.add(className);
  return el;
}

class Renderer {
  private calendar;

  constructor(calendar) {
    this.calendar = calendar;
  }

  getHead(params) {
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
        decs.textContent = parseInt(params.date.getFullYear() / 100, 10) * 100 + '-' + (parseInt(params.date.getFullYear() / 100, 10) * 100 + 99);
        selectedDate.appendChild(decs);
        break;
    }

    const rightArrow = div(styleConsts.ARROW_RIGHT_CLASS);
    rightArrow.textContent = '>';
    selectedDate.appendChild(rightArrow);

    return selectedDate;
  }
}
