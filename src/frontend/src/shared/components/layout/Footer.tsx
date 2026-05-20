import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-300 p-6 text-sm text-black">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-semibold">{t("footer.brand")}</h3>
          <p>{t("footer.tagline")}</p>
        </div>

        <div>
          <h3 className="font-semibold">{t("footer.about")}</h3>
          <ul>
            <li>
              <a href="#" className="hover:underline">
                {t("footer.links.mission")}
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                {t("footer.links.team")}
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                {t("footer.links.partners")}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold">{t("footer.support")}</h3>
          <ul>
            <li>
              <a href="#" className="hover:underline">
                {t("footer.links.faq")}
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                {t("footer.links.contact")}
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                {t("footer.links.terms")}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <p className="text-center mt-6">{t("footer.copyright")}</p>
    </footer>
  );
}