const createStatementData = require('./createStatementData')
let invoices = require('./invoices.json');
let plays = require('./plays.json');

function statement(invoice, plays) {
    return renderPlainText(createStatementData(invoice, plays));
}

function renderPlainText(data) {
    let result = `청구 내역 (고객명: ${data.customer})\n`;
    for (let perf of data.performances) {
        result += ` ${perf.play.name}: ${centToUsd(perf.amount)} (${perf.audience}석)\n`;
    }
    result += `총액: ${centToUsd(data.totalAmount)}\n`;
    result += `적립 포인트: ${data.totalVolumeCredits}점\n`;
    return result;

    function centToUsd(aNumber) {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2
        }).format(aNumber/100);
    }
}

function testStatement(invoices, plays) {
    const result = statement(invoices, plays);
    console.log(result);
    const actual =
`청구 내역 (고객명: BigCo)
 Hamlet: $650.00 (55석)
 As You Like It: $580.00 (35석)
 Othello: $500.00 (40석)
총액: $1,730.00
적립 포인트: 47점
`;
    console.log(`테스트 결과: ${actual === result ? '성공' : '실패'}`);
}

testStatement(invoices, plays);
