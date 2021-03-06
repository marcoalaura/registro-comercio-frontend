import store from '@/store';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

const formatMethods = {
  /**
   * @author dbarra
   * @description formatea una fecha
   * @param { sFormat } DD/MM/YYYY
   * @param { date } date fecha validada por ejemplo usando new Date()
   * @returns { Date }
   */
  format(sFormat, date) {
    return dayjs(date).format(sFormat);
  },
  /**
   * @author dbarra
   * @description formatea una fecha string a otra fecha string
   * @param { date } string por ejemplo '12/12/2021'
   * @param { character } Caracter
   * @param { fromFormat } DD/MM/YYYY
   * @param { toFormat } YYYY-MM-DD
   * @returns { String Date}
   */
  formatStringToString(
    date,
    {
      character = '/',
      fromFormat = 'DD/MM/YYYY',
      toFormat = 'YYYY-MM-DD'
    }
  ) {
    let sDate = date.split(character);
    if (fromFormat === 'DD/MM/YYYY') {
      if (toFormat === 'YYYY-MM-DD') {
        sDate = `${sDate[2]}-${sDate[1]}-${sDate[0]}`;
      }
    }
    return sDate;
  },
};

const getterMethods = {
  /**
   * @author dbarra
   * @description Retorna el dia de la fecha
   * @param { date } date fecha validada por ejemplo usando new Date()
   * @returns { Number }
   */
  getDay(date) {
    return dayjs(dayjs(date).format('YYYY-MM-DD')).date();
  },
  /**
   * @author dbarra
   * @description Retorna el mes en su forma literal
   * @param { date } date fecha validada por ejemplo usando new Date()
   * @returns { Number }
   */
  getLiteralMonth(date) {
    const meses = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    return meses[dayjs(dayjs(date).format('YYYY-MM-DD')).month()];
  },
  /**
   * @author dbarra
   * @description Retorna la hora de la fecha enviada
   * @returns { Number }
   * @param { date } date fecha validada por ejemplo usando new Date()
   */
  getHour(date) {
    let hour = dayjs(date).hour();
    hour = hour > 9 ? hour : `0${hour}`;
    return hour;
  },
  /**
   * @author dbarra
   * @description Retorna los minutos de la fecha enviada
   * @returns { Number }
   * @param { date } date fecha validada por ejemplo usando new Date()
   */
  getMinutes(date) {
    let minutes = dayjs(date).minute();
    minutes = minutes > 9 ? minutes : `0${minutes}`;
    return minutes;
  },
  /**
   * @author dbarra
   * @description Retorna los segundos de la fecha enviada
   * @returns { Number }
   * @param { date } date fecha validada por ejemplo usando new Date()
   */
  getSeconds(date) {
    let seconds = dayjs(date).second();
    seconds = seconds > 9 ? seconds : `0${seconds}`;
    return seconds;
  },
};

const compareMethods = {
  /**
   * @author dbarra
   * @description Calcula la diferencia entre 2 fechas
   * @returns { milliseconds }
   * @param { startDate } Date fecha validada por ejemplo usando new Date()
   * @param { endDate } Date fecha validada por ejemplo usando new Date()
   */
  diff(startDate, endDate) {
    return dayjs(dayjs(startDate).format('YYYY-MM-DD')).diff(
      dayjs(endDate).format('YYYY-MM-DD'),
    );
  },
  /**
   * @author dbarra
   * @description Calcula si una fecha esta entre 2 fechas
   * @returns { boolean }
   * @param { date } date fecha validada por ejemplo usando new Date()
   * @param { startDate } Date fecha validada por ejemplo usando new Date()
   * @param { endDate } Date fecha validada por ejemplo usando new Date()
   */
  between(date, startDate, endDate) {
    return dayjs(dayjs(date).format('YYYY-MM-DD')).isBetween(
      dayjs(startDate).format('YYYY-MM-DD'),
      dayjs(endDate).format('YYYY-MM-DD'),
      null,
      '[]',
    );
  },
};

export default {
  store,
  install: Vue => {
    const DatetimeService = {
      ...formatMethods,
      ...getterMethods,
      ...compareMethods,
    };

    Vue.prototype.$datetime = DatetimeService;
  },
};
