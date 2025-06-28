import Link from "next/link";
import Image from "next/image";
import { TrendingUp, Users, MessageCircle, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="relative">
                <Link href="/" className="relative bg-white dark:bg-gray-800 px-8 py-4 rounded-full shadow-2xl flex items-center space-x-3 hover:shadow-3xl transition-all duration-200">
                  <Image
                    src="/pragttle.png"
                    alt="Pragttle Logo"
                    width={240}
                    height={80}
                    className="h-10 w-auto"
                  />
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Pragttle
                  </span>
                  </Link>
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              Le futur du
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                social media
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Découvrez une plateforme sociale intelligente qui combat la
              désinformation climatique grâce à l&apos;IA. Partagez, connectez-vous,
              et faites la différence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/feed"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Explorer le Feed
              </Link>
              <Link
                href="/explore"
                className="inline-flex items-center px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg border-2 border-gray-200 dark:border-gray-700"
              >
                <TrendingUp className="mr-2 h-5 w-5" />
                Découvrir
              </Link>
            </div>
          </div>
        </div>
      </div>  
      {/* Features Section */}
      <div className="py-24 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Pourquoi choisir Pragttle ?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Une expérience sociale unique avec des fonctionnalités innovantes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-6">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                IA Intelligente
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Détection automatique de la désinformation climatique pour des
                conversations plus éclairées.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-700">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Communauté Engagée
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Rejoignez une communauté passionnée par l&apos;environnement et le
                changement climatique.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Impact Positif
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Contribuez à la sensibilisation climatique et partagez des
                solutions durables.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">1,234</div>
              <div className="text-blue-100">Posts aujourd&apos;hui</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">5,678</div>
              <div className="text-blue-100">Utilisateurs actifs</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">89</div>
              <div className="text-blue-100">Hashtags populaires</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">99%</div>
              <div className="text-blue-100">Précision IA</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Prêt à rejoindre la révolution ?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Commencez dès maintenant à partager, apprendre et contribuer à un
            avenir plus durable.
          </p>
          <Link
            href="/feed"
            className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 text-xl"
          >
            Commencer l&apos;aventure
            <MessageCircle className="ml-2 h-6 w-6" />
          </Link>
        </div>
      </div>
    </div>
  );
}
