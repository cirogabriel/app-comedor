import { useState } from "react";
import { Sun, Moon, Save, Check } from "lucide-react";
import { useAdmin } from "../../context/adminContext.jsx";
import { useAuth } from "../../context/authContext.jsx";

const ConfigSection = () => {
    const { darkMode, setDarkMode, adminUsername, updateAdminUsername } = useAdmin();
    const { admin } = useAuth();
    const [username, setUsername] = useState(adminUsername || admin?.username || '');
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        updateAdminUsername(username);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="space-y-6 max-w-md">
            <div>
                <h2 className="text-xl md:text-2xl font-semibold text-[#1a1a1a] mb-1">Configuración</h2>
                <p className="text-sm text-[#888]">Personaliza tu experiencia</p>
            </div>

            {/* Perfil */}
            <div className="bg-white rounded-2xl border border-[#e8e8e8] p-5 space-y-4">
                <p className="text-sm font-semibold text-[#1a1a1a]">Perfil</p>

                {/* Preview en tiempo real */}
                <div className="flex items-center gap-3 p-3 bg-[#f5f5f0] rounded-xl">
                    <div className="h-9 w-9 rounded-full bg-[#1a1a1a] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                        {username ? username.slice(0, 2).toUpperCase() : 'AD'}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-[#1a1a1a]">{username || 'Admin'}</p>
                        <p className="text-xs text-[#999]">{admin?.email || ''}</p>
                    </div>
                </div>

                <div>
                    <label className="text-xs font-semibold tracking-widest text-[#444] uppercase block mb-1.5">
                        Nombre de usuario
                    </label>
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="w-full px-4 py-3 bg-[#f0f0f0] rounded-xl text-sm text-[#1a1a1a] outline-none border-2 border-transparent focus:border-[#1a1a1a] focus:bg-white transition-all"
                    />
                </div>

                <button onClick={handleSave}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all
                        ${saved
                            ? 'bg-green-600 text-white'
                            : 'bg-[#1a1a1a] text-white hover:bg-[#333]'}`}>
                    {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                    {saved ? '¡Guardado!' : 'Guardar cambios'}
                </button>
            </div>

            {/* Apariencia */}
            <div className="bg-white rounded-2xl border border-[#e8e8e8] p-5">
                <p className="text-sm font-semibold text-[#1a1a1a] mb-4">Apariencia</p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {darkMode
                            ? <Moon className="h-5 w-5 text-[#1a1a1a]" strokeWidth={1.5} />
                            : <Sun className="h-5 w-5 text-[#1a1a1a]" strokeWidth={1.5} />
                        }
                        <div>
                            <p className="text-sm text-[#1a1a1a]">{darkMode ? 'Modo oscuro' : 'Modo claro'}</p>
                            <p className="text-xs text-[#999]">
                                {darkMode ? 'Interfaz en tonos oscuros' : 'Interfaz en tonos claros'}
                            </p>
                        </div>
                    </div>
                    {/* Toggle */}
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className={`relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0
                            ${darkMode ? 'bg-[#f0f0f0]' : 'bg-[#e0e0e0]'}`}>
                        <span className={`absolute top-1 w-4 h-4 rounded-full shadow transition-all duration-300
                            ${darkMode ? 'left-7 bg-[#1a1a1a]' : 'left-1 bg-white'}`}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfigSection;