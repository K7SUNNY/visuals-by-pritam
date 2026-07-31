# Project File Tree

```
Pritem_web/
├── .agents/
│   └── skills/
│       └── ui-ux-pro-max/
│           ├── SKILL.md
│           ├── data/
│           │   ├── app-interface.csv
│           │   ├── charts.csv
│           │   ├── colors.csv
│           │   ├── google-fonts.csv
│           │   ├── icons.csv
│           │   ├── landing.csv
│           │   ├── motion.csv
│           │   ├── products.csv
│           │   ├── react-performance.csv
│           │   ├── stacks/
│           │   │   ├── angular.csv
│           │   │   ├── astro.csv
│           │   │   ├── avalonia.csv
│           │   │   ├── flutter.csv
│           │   │   ├── html-tailwind.csv
│           │   │   ├── javafx.csv
│           │   │   ├── jetpack-compose.csv
│           │   │   ├── laravel.csv
│           │   │   ├── nextjs.csv
│           │   │   ├── nuxtjs.csv
│           │   │   ├── nuxt-ui.csv
│           │   │   ├── react.csv
│           │   │   ├── react-native.csv
│           │   │   ├── shadcn.csv
│           │   │   ├── svelte.csv
│           │   │   ├── swiftui.csv
│           │   │   ├── threejs.csv
│           │   │   ├── uno.csv
│           │   │   ├── uwp.csv
│           │   │   ├── vue.csv
│           │   │   ├── winui.csv
│           │   │   └── wpf.csv
│           │   ├── styles.csv
│           │   ├── typography.csv
│           │   ├── ui-reasoning.csv
│           │   └── ux-guidelines.csv
│           ├── references/
│           │   ├── pro-rules.md
│           │   └── quick-reference.md
│           ├── scripts/
│           │   ├── core.py
│           │   ├── design_system.py
│           │   ├── search.py
│           │   ├── validate_data.py
│           │   └── tests/
│           │       ├── test_core.py
│           │       └── test_design_system_mode.py
│           └── data/
│               └── stacks/
│                   └── (see above)
├── .claude/
│   └── skills/
│       └── ui-ux-pro-max/
├── .editorconfig
├── .env
├── .env.example
├── .env.local.example
├── .oxlintrc.json
├── .prettierignore
├── .prettierrc
├── eslint.config.js
├── index.html
├── LICENSE
├── package.json
├── package-lock.json
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   └── profile_pic.jpg
├── README.md
├── skills-lock.json
├── src/
│   ├── animations/
│   │   ├── index.ts
│   │   └── variants.ts
│   ├── app/
│   │   ├── layouts/
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── index.ts
│   │   │   └── PublicLayout.tsx
│   │   ├── providers/
│   │   │   ├── AppProviders.tsx
│   │   │   ├── index.ts
│   │   │   ├── MotionProvider.tsx
│   │   │   ├── SupabaseProvider.tsx
│   │   │   └── ToastProvider.tsx
│   │   └── router/
│   │       └── index.ts
│   ├── assets/
│   │   ├── fonts/
│   │   ├── hero.png
│   │   ├── icons/
│   │   ├── images/
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminHeader.tsx
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── index.ts
│   │   │   ├── UploadForm.tsx
│   │   │   └── WorkCard.tsx
│   │   ├── common/
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── index.ts
│   │   │   └── LoadingSpinner.tsx
│   │   ├── layout/
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── index.ts
│   │   │   └── Navbar.tsx
│   │   ├── portfolio/
│   │   │   ├── About.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── ContactSection.tsx
│   │   │   ├── FeaturedWork.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── index.ts
│   │   │   ├── PortfolioGallery.tsx
│   │   │   ├── PortfolioGrid.tsx
│   │   │   └── PortfolioItem.tsx
│   │   └── ui/
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Dialog.tsx
│   │       ├── EmptyState.tsx
│   │       ├── ErrorState.tsx
│   │       ├── index.ts
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── Skeleton.tsx
│   │       ├── Tabs.tsx
│   │       └── Typography.tsx
│   ├── config/
│   │   ├── index.ts
│   │   ├── site.ts
│   │   └── upload.ts
│   ├── constants/
│   │   ├── config.ts
│   │   ├── index.ts
│   │   └── routes.ts
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── index.ts
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   └── LoginForm.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts
│   │   │   ├── index.ts
│   │   │   └── services/
│   │   │       └── authService.ts
│   │   ├── contact/
│   │   │   ├── components/
│   │   │   │   └── ContactForm.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useContact.ts
│   │   │   └── index.ts
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   │   └── DashboardStats.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useDashboard.ts
│   │   │   └── index.ts
│   │   ├── portfolio/
│   │   │   ├── components/
│   │   │   │   └── PortfolioList.tsx
│   │   │   ├── hooks/
│   │   │   │   └── usePortfolio.ts
│   │   │   └── index.ts
│   │   └── settings/
│   │       ├── components/
│   │       │   └── SettingsForm.tsx
│   │       ├── hooks/
│   │       │   └── useSettings.ts
│   │       └── index.ts
│   ├── hooks/
│   │   ├── index.ts
│   │   ├── useDebounce.ts
│   │   └── useLocalStorage.ts
│   ├── integrations/
│   │   └── supabase/
│   │       ├── auth.ts
│   │       ├── client.ts
│   │       ├── index.ts
│   │       ├── portfolio.ts
│   │       ├── settings.ts
│   │       └── storage.ts
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── index.ts
│   │   │   └── storage.ts
│   │   ├── utils/
│   │   │   ├── cn.ts
│   │   │   ├── format.ts
│   │   │   └── index.ts
│   │   └── validations/
│   │       ├── auth.ts
│   │       ├── index.ts
│   │       ├── portfolio.ts
│   │       └── settings.ts
│   ├── main.tsx
│   ├── media/
│   │   ├── compressImage.ts
│   │   ├── extractVideoMetadata.ts
│   │   ├── generateThumbnail.ts
│   │   ├── index.ts
│   │   ├── supportedFormats.ts
│   │   └── validateMedia.ts
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── SettingsPage.tsx
│   │   │   ├── UploadPage.tsx
│   │   │   └── WorksPage.tsx
│   │   ├── NotFoundPage.tsx
│   │   └── public/
│   │       ├── ContactPage.tsx
│   │       ├── HomePage.tsx
│   │       └── PortfolioPage.tsx
│   ├── repositories/
│   │   ├── AuthRepository.ts
│   │   ├── index.ts
│   │   ├── PortfolioRepository.ts
│   │   └── SettingsRepository.ts
│   ├── routes/
│   │   ├── AppRouter.tsx
│   │   └── index.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── index.ts
│   │   ├── portfolioService.ts
│   │   └── settingsService.ts
│   ├── styles/
│   │   ├── toast.css
│   │   └── tokens.css
│   ├── types/
│   │   ├── auth.ts
│   │   ├── category.ts
│   │   ├── index.ts
│   │   ├── portfolio.ts
│   │   ├── profile.ts
│   │   └── settings.ts
│   ├── upload/
│   │   ├── index.ts
│   │   └── UploadManager.ts
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   └── vite-env.d.ts
├── supabase/
│   ├── .temp/
│   │   ├── gotrue-version
│   │   ├── linked-project.json
│   │   ├── pooler-url
│   │   ├── postgres-version
│   │   ├── project-ref
│   │   ├── rest-version
│   │   ├── storage-migration
│   │   └── storage-version
│   ├── migrations/
│   └── setup.sql
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── txt.txt
└── vite.config.ts
```