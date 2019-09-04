interface correctParams {
    day?: number;
    month?: number;
    year?: number;
    decs?: number;
}

export default class Calendar {
    get dateCurrent(): Date {
        return new Date();
    }

    get selectedMonth(): number {
        return 0;
    }

    isCorrect(params: correctParams): boolean {
        return true;
    }

    getDate(): Date {
        return new Date();
    }
}
