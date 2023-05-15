// const i_rate_10 = document.getElementById('tasa10')
// const i_rate_30 = document.getElementById('tasa30')
const i_price = document.getElementById('precio')
const i_downpayment = document.getElementById('enganche')
const i_periods = document.getElementById('plazo')
const btn_getQ = document.getElementById('cotizar')
const p_payment = document.getElementById('mensualidad')

let rate10 = 12.49
let rate30 = 11.49
let price
let downpayment
let periods
let payment
const tax = .16

// const setRate10 = e => rate10 = parseFloat(e.target.value)
// const setRate30 = e => rate30 = parseFloat(e.target.value)
const setPrice = e => price = parseInt(e.target.value)
const setDownPayment = e => downpayment = parseInt(e.target.value)
const setPeriods = e => periods = parseInt(e.target.value)

const getQuotation = () => {
    const pago = heyBancoQuotation(price, downpayment, periods, rate10, rate30, tax)
    p_payment.value = pago.toFixed(2)
}

// i_rate_10.addEventListener('change', setRate10)
// i_rate_30.addEventListener('change', setRate30)
i_price.addEventListener('change', setPrice)
i_downpayment.addEventListener('change', setDownPayment)
i_periods.addEventListener('change', setPeriods)
btn_getQ.addEventListener('click', getQuotation)


const heyBancoQuotation = (price, downpayment, periods, rate10, rate30, tax) => {
    const pv = price - downpayment
    const fakerate = downpayment / price < .3 ? rate10 / 100 : rate30 / 100
    const rate_patterns = [
        1.0333346,
        .9999986,
        1.0333342,
        1.0000024,
        1.0333341,
        1.0333311,
        .9333359,
        1.0333326,
        1.0000029,
        1.0333355,
        1.0000010,
        1.0333336,
    ]
    const monthly_rates = rate_patterns.map(r => r * (fakerate / 12))
    const real_anual_rate_no_tax = monthly_rates.reduce((previous, current) => previous + current, 0)
    const real_montly_rate_plus_tax = (real_anual_rate_no_tax / 12) * (1 + tax)
    console.log(`precio: ${price}, tasa: ${fakerate*100}%, monto a financiar: ${pv}, tasa real: ${(real_anual_rate_no_tax*100).toFixed(2)}%, enganche: ${downpayment}, plazo: ${periods} meses, mensualidad: aún no`)
    console.log(real_montly_rate_plus_tax)

    function PMT(ir, np, pv, fv, type) {
        /*
         * ir   - interest rate per month
         * np   - number of periods (months)
         * pv   - present value
         * fv   - future value
         * type - when the payments are due:
         *        0: end of the period, e.g. end of month (default)
         *        1: beginning of period
         */
        var pmt, pvif;

        fv || (fv = 0);
        type || (type = 0);

        if (ir === 0)
            return -(pv + fv) / np;

        pvif = Math.pow(1 + ir, np);
        pmt = -ir * (pv * pvif + fv) / (pvif - 1);

        if (type === 1)
            pmt /= (1 + ir);

        return pmt;
    }

    const payment = PMT(real_montly_rate_plus_tax, periods, pv, 0, 0) - 3
    console.log(-payment)
    return -payment
}