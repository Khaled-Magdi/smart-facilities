import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Moon, Sun, Languages, Building2, Save, Users, Palette, Plus, Pencil, UserX, UserCheck, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingState, LoadingSpinner } from "@/components/loading-state";
import { useLanguage } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Checkbox } from "@/components/ui/checkbox";
import type { Settings, User } from "@shared/schema";
import { AVAILABLE_SCREENS } from "@shared/schema";

export default function SettingsPage() {
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === "admin";

  const { data: settings, isLoading: settingsLoading } = useQuery<Settings>({
    queryKey: ["/api/settings"],
  });

  const { data: users = [], isLoading: usersLoading } = useQuery<Omit<User, "password">[]>({
    queryKey: ["/api/users"],
    enabled: isAdmin,
  });

  const [companyNameAr, setCompanyNameAr] = useState("");
  const [companyNameEn, setCompanyNameEn] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Omit<User, "password"> | null>(null);
  const [userForm, setUserForm] = useState({
    username: "",
    password: "",
    nameAr: "",
    nameEn: "",
    role: "user",
    isActive: true,
    allowedScreens: ["dashboard", "facilities", "master-data", "inventory", "reports", "settings"] as string[],
  });

  useEffect(() => {
    if (settings) {
      setCompanyNameAr(settings.companyNameAr || "");
      setCompanyNameEn(settings.companyNameEn || "");
      setLogoUrl(settings.logoUrl || "");
    }
  }, [settings]);

  const updateSettingsMutation = useMutation({
    mutationFn: (data: Partial<Settings>) => apiRequest("PATCH", "/api/settings", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({ title: language === "ar" ? "تم حفظ الإعدادات" : "Settings saved" });
    },
  });

  const createUserMutation = useMutation({
    mutationFn: (data: typeof userForm) => apiRequest("POST", "/api/users", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setUserDialogOpen(false);
      resetUserForm();
      toast({ title: language === "ar" ? "تم إنشاء المستخدم" : "User created" });
    },
    onError: (error: Error) => {
      toast({ title: error.message, variant: "destructive" });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<typeof userForm> }) =>
      apiRequest("PATCH", `/api/users/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setUserDialogOpen(false);
      resetUserForm();
      toast({ title: language === "ar" ? "تم تحديث المستخدم" : "User updated" });
    },
    onError: (error: Error) => {
      toast({ title: error.message, variant: "destructive" });
    },
  });

  const resetUserForm = () => {
    setEditingUser(null);
    setUserForm({
      username: "",
      password: "",
      nameAr: "",
      nameEn: "",
      role: "user",
      isActive: true,
      allowedScreens: ["dashboard", "facilities", "master-data", "inventory", "reports", "settings"],
    });
  };

  const handleSaveCompany = () => {
    updateSettingsMutation.mutate({
      companyNameAr,
      companyNameEn,
      logoUrl: logoUrl || null,
    });
  };

  const handleAddUser = () => {
    resetUserForm();
    setUserDialogOpen(true);
  };

  const handleEditUser = (user: Omit<User, "password">) => {
    setEditingUser(user);
    setUserForm({
      username: user.username,
      password: "",
      nameAr: user.nameAr || "",
      nameEn: user.nameEn || "",
      role: user.role,
      isActive: user.isActive ?? true,
      allowedScreens: user.allowedScreens || ["dashboard", "facilities", "master-data", "inventory", "reports", "settings"],
    });
    setUserDialogOpen(true);
  };

  const handleToggleUserStatus = (user: Omit<User, "password">) => {
    updateUserMutation.mutate({
      id: user.id,
      data: { isActive: !user.isActive },
    });
  };

  const handleSaveUser = () => {
    if (editingUser) {
      const updateData: Partial<typeof userForm> = {
        nameAr: userForm.nameAr,
        nameEn: userForm.nameEn,
        role: userForm.role,
        isActive: userForm.isActive,
        allowedScreens: userForm.allowedScreens,
      };
      if (userForm.password) {
        updateData.password = userForm.password;
      }
      updateUserMutation.mutate({ id: editingUser.id, data: updateData });
    } else {
      createUserMutation.mutate(userForm);
    }
  };

  const toggleScreen = (screenId: string) => {
    setUserForm(prev => ({
      ...prev,
      allowedScreens: prev.allowedScreens.includes(screenId)
        ? prev.allowedScreens.filter(s => s !== screenId)
        : [...prev.allowedScreens, screenId],
    }));
  };

  const translations = {
    interfaceSettings: { ar: "إعدادات الواجهة", en: "Interface Settings" },
    companySettings: { ar: "إعدادات الشركة", en: "Company Settings" },
    userSettings: { ar: "إدارة المستخدمين", en: "User Management" },
    language: { ar: "اللغة", en: "Language" },
    theme: { ar: "المظهر", en: "Theme" },
    companyName: { ar: "اسم الشركة", en: "Company Name" },
    companyLogo: { ar: "شعار الشركة", en: "Company Logo" },
    logoUrl: { ar: "رابط الشعار", en: "Logo URL" },
    addUser: { ar: "إضافة مستخدم", en: "Add User" },
    editUser: { ar: "تعديل مستخدم", en: "Edit User" },
    username: { ar: "اسم المستخدم", en: "Username" },
    password: { ar: "كلمة المرور", en: "Password" },
    role: { ar: "الدور", en: "Role" },
    admin: { ar: "مدير", en: "Admin" },
    user: { ar: "مستخدم", en: "User" },
    status: { ar: "الحالة", en: "Status" },
    active: { ar: "نشط", en: "Active" },
    inactive: { ar: "غير نشط", en: "Inactive" },
    actions: { ar: "الإجراءات", en: "Actions" },
    light: { ar: "فاتح", en: "Light" },
    dark: { ar: "داكن", en: "Dark" },
    save: { ar: "حفظ", en: "Save" },
    cancel: { ar: "إلغاء", en: "Cancel" },
    newPassword: { ar: "كلمة مرور جديدة (اختياري)", en: "New Password (optional)" },
    allowedScreens: { ar: "الشاشات المتاحة", en: "Allowed Screens" },
  };

  const getText = (key: keyof typeof translations) => translations[key][language];

  if (settingsLoading) {
    return <LoadingState />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-page-title">
          {t("settings")}
        </h1>
      </div>

      <Tabs defaultValue="interface" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-lg">
          <TabsTrigger value="interface" data-testid="tab-interface" className="gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">{getText("interfaceSettings")}</span>
          </TabsTrigger>
          <TabsTrigger value="company" data-testid="tab-company" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">{getText("companySettings")}</span>
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="users" data-testid="tab-users" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">{getText("userSettings")}</span>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="interface" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Languages className="h-5 w-5" />
                  {getText("language")}
                </CardTitle>
                <CardDescription>
                  {language === "ar" ? "اختر لغة الواجهة المفضلة" : "Choose your preferred interface language"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">العربية</p>
                    <p className="text-sm text-muted-foreground">Arabic language</p>
                  </div>
                  <Switch
                    checked={language === "ar"}
                    onCheckedChange={(checked) => setLanguage(checked ? "ar" : "en")}
                    data-testid="switch-arabic"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">English</p>
                    <p className="text-sm text-muted-foreground">اللغة الإنجليزية</p>
                  </div>
                  <Switch
                    checked={language === "en"}
                    onCheckedChange={(checked) => setLanguage(checked ? "en" : "ar")}
                    data-testid="switch-english"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  {getText("theme")}
                </CardTitle>
                <CardDescription>
                  {language === "ar" ? "اختر مظهر الواجهة المفضل" : "Choose your preferred interface theme"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{getText("light")}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === "ar" ? "المظهر الفاتح" : "Light appearance"}
                    </p>
                  </div>
                  <Switch
                    checked={theme === "light"}
                    onCheckedChange={(checked) => setTheme(checked ? "light" : "dark")}
                    data-testid="switch-light-theme"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{getText("dark")}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === "ar" ? "المظهر الداكن" : "Dark appearance"}
                    </p>
                  </div>
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                    data-testid="switch-dark-theme"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="company" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {getText("companySettings")}
              </CardTitle>
              <CardDescription>
                {language === "ar" ? "قم بتحديث معلومات الشركة" : "Update your company information"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyNameAr">{t("nameAr")}</Label>
                  <Input
                    id="companyNameAr"
                    value={companyNameAr}
                    onChange={(e) => setCompanyNameAr(e.target.value)}
                    placeholder={language === "ar" ? "اسم الشركة بالعربية" : "Company name in Arabic"}
                    data-testid="input-company-name-ar"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyNameEn">{t("nameEn")}</Label>
                  <Input
                    id="companyNameEn"
                    value={companyNameEn}
                    onChange={(e) => setCompanyNameEn(e.target.value)}
                    placeholder={language === "ar" ? "اسم الشركة بالإنجليزية" : "Company name in English"}
                    data-testid="input-company-name-en"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logoUrl">{getText("logoUrl")}</Label>
                <div className="flex gap-2">
                  <Input
                    id="logoUrl"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://example.com/logo.png"
                    data-testid="input-logo-url"
                    className="flex-1"
                  />
                </div>
                {logoUrl && (
                  <div className="mt-4 p-4 border rounded-md">
                    <p className="text-sm text-muted-foreground mb-2">{getText("companyLogo")}</p>
                    <img src={logoUrl} alt="Company Logo" className="max-h-20 object-contain" />
                  </div>
                )}
              </div>

              <Button
                onClick={handleSaveCompany}
                disabled={updateSettingsMutation.isPending}
                data-testid="button-save-settings"
              >
                {updateSettingsMutation.isPending ? (
                  <LoadingSpinner size="sm" className="me-2" />
                ) : (
                  <Save className="h-4 w-4 me-2" />
                )}
                {getText("save")}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {getText("userSettings")}
                  </CardTitle>
                  <CardDescription>
                    {language === "ar" ? "إدارة المستخدمين والصلاحيات" : "Manage users and permissions"}
                  </CardDescription>
                </div>
                <Button onClick={handleAddUser} data-testid="button-add-user">
                  <Plus className="h-4 w-4 me-2" />
                  {getText("addUser")}
                </Button>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <LoadingSpinner />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{getText("username")}</TableHead>
                        <TableHead>{language === "ar" ? "الاسم" : "Name"}</TableHead>
                        <TableHead>{getText("role")}</TableHead>
                        <TableHead>{getText("status")}</TableHead>
                        <TableHead>{getText("actions")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id} data-testid={`row-user-${user.id}`}>
                          <TableCell className="font-medium">{user.username}</TableCell>
                          <TableCell>{language === "ar" ? user.nameAr : user.nameEn}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                              {user.role === "admin" ? getText("admin") : getText("user")}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.isActive ? "default" : "outline"}>
                              {user.isActive ? getText("active") : getText("inactive")}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditUser(user)}
                                data-testid={`button-edit-user-${user.id}`}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleToggleUserStatus(user)}
                                data-testid={`button-toggle-user-${user.id}`}
                                disabled={user.id === currentUser?.id}
                              >
                                {user.isActive ? (
                                  <UserX className="h-4 w-4 text-destructive" />
                                ) : (
                                  <UserCheck className="h-4 w-4 text-green-600" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingUser ? getText("editUser") : getText("addUser")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user-username">{getText("username")}</Label>
              <Input
                id="user-username"
                value={userForm.username}
                onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                disabled={!!editingUser}
                data-testid="input-user-username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-password">
                {editingUser ? getText("newPassword") : getText("password")}
              </Label>
              <Input
                id="user-password"
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                data-testid="input-user-password"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="user-nameAr">{t("nameAr")}</Label>
                <Input
                  id="user-nameAr"
                  value={userForm.nameAr}
                  onChange={(e) => setUserForm({ ...userForm, nameAr: e.target.value })}
                  data-testid="input-user-nameAr"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-nameEn">{t("nameEn")}</Label>
                <Input
                  id="user-nameEn"
                  value={userForm.nameEn}
                  onChange={(e) => setUserForm({ ...userForm, nameEn: e.target.value })}
                  data-testid="input-user-nameEn"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-role">{getText("role")}</Label>
              <Select
                value={userForm.role}
                onValueChange={(value) => setUserForm({ ...userForm, role: value })}
              >
                <SelectTrigger id="user-role" data-testid="select-user-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">{getText("user")}</SelectItem>
                  <SelectItem value="admin">{getText("admin")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="user-active">{getText("active")}</Label>
              <Switch
                id="user-active"
                checked={userForm.isActive}
                onCheckedChange={(checked) => setUserForm({ ...userForm, isActive: checked })}
                data-testid="switch-user-active"
              />
            </div>
            <div className="space-y-2">
              <Label>{getText("allowedScreens")}</Label>
              <div className="grid grid-cols-2 gap-3 border rounded-md p-3">
                {AVAILABLE_SCREENS.map((screen) => (
                  <div key={screen.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`screen-${screen.id}`}
                      checked={userForm.allowedScreens.includes(screen.id)}
                      onCheckedChange={() => toggleScreen(screen.id)}
                      data-testid={`checkbox-screen-${screen.id}`}
                    />
                    <Label htmlFor={`screen-${screen.id}`} className="text-sm font-normal cursor-pointer">
                      {language === "ar" ? screen.nameAr : screen.nameEn}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserDialogOpen(false)}>
              {getText("cancel")}
            </Button>
            <Button
              onClick={handleSaveUser}
              disabled={createUserMutation.isPending || updateUserMutation.isPending}
              data-testid="button-save-user"
            >
              {(createUserMutation.isPending || updateUserMutation.isPending) && (
                <LoadingSpinner size="sm" className="me-2" />
              )}
              {getText("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
