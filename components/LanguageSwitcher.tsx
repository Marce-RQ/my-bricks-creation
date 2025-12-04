"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, localeNames, localeFlags, type Locale } from "@/i18n/config";
import { useState, useRef, useEffect } from "react";

export default function LanguageSwitcher() {
	const locale = useLocale() as Locale;
	const pathname = usePathname();
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const handleLocaleChange = (newLocale: Locale) => {
		router.replace(pathname, { locale: newLocale });
		setIsOpen(false);
	};

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 
                         transition-colors text-sm font-medium text-gray-700"
				aria-label="Change language"
			>
				<span className="text-lg">{localeFlags[locale]}</span>
				<span className="hidden sm:inline">{localeNames[locale]}</span>
				<svg
					className={`w-4 h-4 transition-transform ${
						isOpen ? "rotate-180" : ""
					}`}
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>

			{isOpen && (
				<div
					className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg 
                            border border-gray-100 overflow-hidden z-50 animate-in"
				>
					{locales.map((loc) => (
						<button
							key={loc}
							onClick={() => handleLocaleChange(loc)}
							className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm
                                     transition-colors hover:bg-gray-50
                                     ${
											locale === loc
												? "bg-lego-yellow/10 text-lego-dark font-medium"
												: "text-gray-700"
										}`}
						>
							<span className="text-lg">{localeFlags[loc]}</span>
							<span>{localeNames[loc]}</span>
							{locale === loc && (
								<svg
									className="w-4 h-4 ml-auto text-lego-red"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clipRule="evenodd"
									/>
								</svg>
							)}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
