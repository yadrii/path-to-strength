import { useLanguage } from '@/contexts/LanguageContext';
import { Switch } from '@/components/ui/switch';

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 text-sm font-medium">
      <span className={language === 'en' ? 'text-foreground' : 'text-muted-foreground'}>EN</span>
      <Switch
        checked={language === 'ne'}
        onCheckedChange={(checked) => setLanguage(checked ? 'ne' : 'en')}
        className="data-[state=checked]:bg-primary"
      />
      <span className={language === 'ne' ? 'text-foreground' : 'text-muted-foreground'}>नेपाली</span>
    </div>
  );
};

export default LanguageToggle;
