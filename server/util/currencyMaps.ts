export default function CurrencyToSymbolMap(currency: string) {
    switch (currency) {
        case "usd":
            return "$";
        case "eur":
            return "€";
        case "gbp":
            return "£";
        default:
            return "$";
    }
}