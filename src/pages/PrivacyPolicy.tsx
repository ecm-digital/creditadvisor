import React from 'react';

export const PrivacyPolicy: React.FC = () => {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Polityka Prywatności</h1>
            <p style={{ color: '#666', marginBottom: '2rem' }}>Ostatnia aktualizacja: 6 lutego 2026</p>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>1. Administrator danych osobowych</h2>
                <p>
                    Administratorem Twoich danych osobowych jest <strong>Tomasz Blachliński</strong>,
                    świadczący usługi doradztwa kredytowego.
                </p>
                <p>Kontakt: email poprzez formularz kontaktowy lub telefonicznie: +48 535 330 323</p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>2. Jakie dane zbieramy?</h2>
                <p>Zbieramy następujące dane osobowe:</p>
                <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
                    <li><strong>Imię i nazwisko</strong> - w celu identyfikacji klienta</li>
                    <li><strong>Adres e-mail</strong> - w celu kontaktu oraz wysyłki informacji</li>
                    <li><strong>Numer telefonu</strong> - w celu kontaktu telefonicznego</li>
                    <li><strong>Dane finansowe</strong> (opcjonalnie) - podane dobrowolnie w celu analizy zdolności kredytowej</li>
                    <li><strong>Dane techniczne</strong> - adres IP, cookies, informacje o przeglądarce (automatycznie)</li>
                </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>3. W jakim celu przetwarzamy dane?</h2>
                <p>Twoje dane są przetwarzane w następujących celach:</p>
                <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
                    <li>Świadczenie usług doradztwa kredytowego (podstawa prawna: umowa - Art. 6 ust. 1 lit. b RODO)</li>
                    <li>Kontakt z klientem w sprawie oferty (podstawa prawna: prawnie uzasadniony interes - Art. 6 ust. 1 lit. f RODO)</li>
                    <li>Marketing usług własnych (podstawa prawna: zgoda - Art. 6 ust. 1 lit. a RODO lub prawnie uzasadniony interes)</li>
                    <li>Analiza statystyk strony www (Google Analytics) - w celach marketingowych i analitycznych</li>
                    <li>Wypełnienie obowiązków prawnych (podstawa prawna: obowiązek prawny - Art. 6 ust. 1 lit. c RODO)</li>
                </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>4. Komu udostępniamy dane?</h2>
                <p>Twoje dane mogą być udostępniane następującym odbiorcom:</p>
                <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
                    <li><strong>Banki i instytucje finansowe</strong> - wyłącznie za Twoją zgodą, w celu uzyskania oferty kredytowej</li>
                    <li><strong>Dostawcy usług IT</strong> - Firebase (Google), hosting strony internetowej</li>
                    <li><strong>Narzędzia analityczne</strong> - Google Analytics (anonimizowane dane)</li>
                    <li><strong>Podmioty uprawnione na podstawie prawa</strong> - np. organy państwowe na żądanie prawne</li>
                </ul>
                <p><strong>Nie sprzedajemy Twoich danych osobowych osobom trzecim.</strong></p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>5. Jak długo przechowujemy dane?</h2>
                <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
                    <li>Dane klientów, z którymi podpisano umowę: <strong>5 lat</strong> (wymóg rachunkowy)</li>
                    <li>Dane z formularzy kontaktowych bez zawarcia umowy: <strong>do 3 lat</strong> lub do momentu wycofania zgody</li>
                    <li>Dane techniczne (logi, cookies): <strong>do 12 miesięcy</strong></li>
                    <li>Po upływie okresu przechowywania dane są trwale usuwane</li>
                </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>6. Twoje prawa (RODO)</h2>
                <p>Masz prawo do:</p>
                <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
                    <li><strong>Dostępu do danych</strong> - możesz poprosić o kopię swoich danych osobowych</li>
                    <li><strong>Sprostowania</strong> - możesz poprosić o korektę nieprawidłowych danych</li>
                    <li><strong>Usunięcia danych</strong> ("prawo do bycia zapomnianym") - po spełnieniu warunków prawnych</li>
                    <li><strong>Ograniczenia przetwarzania</strong> - w określonych sytuacjach</li>
                    <li><strong>Przenoszenia danych</strong> - otrzymanie danych w formacie umożliwiającym przesłanie do innego administratora</li>
                    <li><strong>Wyrażenia sprzeciwu</strong> wobec przetwarzania (np. marketing bezpośredni)</li>
                    <li><strong>Cofnięcia zgody</strong> w dowolnym momencie (jeśli przetwarzanie opiera się na zgodzie)</li>
                    <li><strong>Wniesienia skargi do UODO</strong> (Urząd Ochrony Danych Osobowych)</li>
                </ul>
                <p>Aby skorzystać z powyższych praw, skontaktuj się z nami poprzez formularz kontaktowy.</p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>7. Pliki cookies</h2>
                <p>
                    Strona www.blachlinski.pl używa plików cookies (ciasteczka) w celu:
                </p>
                <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
                    <li>Zapewnienia prawidłowego działania strony (cookies funkcjonalne)</li>
                    <li>Analizy ruchu na stronie - Google Analytics (cookies analityczne)</li>
                    <li>Zapamiętania preferencji użytkownika (np. zalogowanie)</li>
                </ul>
                <p>
                    Możesz zarządzać cookies w ustawieniach swojej przeglądarki. Wyłączenie cookies może ograniczyć
                    funkcjonalność strony.
                </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>8. Google Analytics</h2>
                <p>
                    Używamy Google Analytics do analizy statystyk odwiedzin strony. Google Analytics zbiera
                    anonimowe dane o korzystaniu ze strony (liczba odwiedzin, źródło ruchu, czas spędzony na stronie).
                </p>
                <p>
                    Więcej informacji: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                        Polityka prywatności Google
                    </a>
                </p>
                <p>
                    Możesz zrezygnować ze śledzenia przez Google Analytics instalując dodatek:{' '}
                    <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
                        Google Analytics Opt-out Browser Add-on
                    </a>
                </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>9. Bezpieczeństwo danych</h2>
                <p>
                    Stosujemy środki techniczne i organizacyjne zapewniające bezpieczeństwo Twoich danych:
                </p>
                <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
                    <li>Szyfrowanie połączenia HTTPS (SSL)</li>
                    <li>Bezpieczne przechowywanie danych w Firebase (Google Cloud Platform)</li>
                    <li>Regularne kopie zapasowe</li>
                    <li>Ograniczony dostęp do danych osobowych tylko dla upoważnionych osób</li>
                </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>10. Zmiany w polityce prywatności</h2>
                <p>
                    Zastrzegamy sobie prawo do wprowadzania zmian w niniejszej polityce prywatności.
                    O wszelkich zmianach poinformujemy na tej stronie, podając datę ostatniej aktualizacji.
                </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>11. Kontakt</h2>
                <p>
                    W razie pytań dotyczących przetwarzania danych osobowych, skontaktuj się z nami:
                </p>
                <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
                    <li>Email: poprzez formularz kontaktowy na stronie głównej</li>
                    <li>Telefon: +48 535 330 323</li>
                </ul>
            </section>

            <div style={{ marginTop: '3rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>
                    Niniejsza polityka prywatności została ostatnio zaktualizowana w dniu 6 lutego 2026 r.
                    i jest zgodna z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r.
                    (RODO).
                </p>
            </div>
        </div>
    );
};
