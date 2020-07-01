function statement(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances;
    return renderPlainText(statementData, invoice, plays);
}

function renderPlainText(data, invoice, plays) {
    let result = `청구 내역 (고객명: ${data.customer})\n`;
    for (let perf of data.performances) {
        result += ` ${playFor(perf).name}: ${centToUsd(amountFor(perf))} (${perf.audience}석)\n`;
    }
    result += `총액: ${centToUsd(totalAmount())}\n`;
    result += `적립 포인트: ${totalVolumeCredits()}점\n`;
    return result;

    function amountFor(aPerformance) {
        let result;
        switch (playFor(aPerformance).type) {
            case "tragedy":
                result = 40000;
                if (aPerformance.audience > 30) {
                    result += 1000 * (aPerformance.audience - 30);
                }
                break;
            case "comedy":
                result = 30000;
                if (aPerformance.audience > 20) {
                    result += 10000 + 500 * (aPerformance.audience - 20);
                }
                result += 300 * aPerformance.audience;
                break;
            default:
                throw new Error('알 수 없는 장르: ${playFor(aPerformance).type}');
        }
        return result;
    }

    function playFor(perf) {
        return plays[perf.playID];
    }

    function volumeCreditsFor(aPerformance) {
        let result = 0;
        result += Math.max(aPerformance.audience - 30, 0);
        if ("comedy" === playFor(aPerformance).type)
            result += Math.floor(aPerformance.audience / 5);
        return result;
    }

    function centToUsd(aNumber) {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2
        }).format(aNumber/100);
    }

    function totalVolumeCredits() {
        let result = 0;
        for (let perf of data.performances) {
            result += volumeCreditsFor(perf);
        }
        return result;
    }

    function totalAmount() {
        let result = 0;
        for (let perf of data.performances) {
            result += amountFor(perf);
        }
        return result;
    }
}

let invoices = require('./invoices.json');
let plays = require('./plays.json');

function testStatement(invoices, plays) {
    const result = statement(invoices, plays);
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
