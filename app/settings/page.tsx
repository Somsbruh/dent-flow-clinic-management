"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Clock, Bell, Shield, Save, DoorOpen, Plus, Edit, Trash2 } from "lucide-react"
import { dentalRooms } from "@/lib/data"

export default function SettingsPage() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [clinicInfo, setClinicInfo] = useState({
    name: "DentFlow Dental Clinic",
    address: "123 Healthcare Ave, Los Angeles, CA 90001",
    phone: "(555) 123-4567",
    email: "contact@dentflow.com",
    website: "www.dentflow.com",
  })

  const [workingHours, setWorkingHours] = useState({
    monday: { open: "09:00", close: "18:00", enabled: true },
    tuesday: { open: "09:00", close: "18:00", enabled: true },
    wednesday: { open: "09:00", close: "18:00", enabled: true },
    thursday: { open: "09:00", close: "18:00", enabled: true },
    friday: { open: "09:00", close: "17:00", enabled: true },
    saturday: { open: "10:00", close: "14:00", enabled: true },
    sunday: { open: "09:00", close: "18:00", enabled: false },
  })

  const [notifications, setNotifications] = useState({
    appointmentReminder: true,
    appointmentConfirmation: true,
    lowStock: true,
    paymentReminder: true,
    staffAbsence: true,
  })

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />
      <div className="flex-1 lg:ml-[240px]">
        <Header onMenuClick={() => setIsMobileSidebarOpen(true)} />
        <main className="p-4 md:p-6">
          {/* Page Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Settings</h1>
            <p className="mt-1 text-sm md:text-base text-muted-foreground">
              Manage your clinic settings and preferences
            </p>
          </div>

          <Tabs defaultValue="clinic" className="space-y-6">
            <TabsList className="rounded-xl bg-background p-1 neu-pressed flex overflow-x-auto w-full h-auto gap-1">
              <TabsTrigger
                value="clinic"
                className="rounded-lg data-[state=active]:neu-button data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-shrink-0 text-xs md:text-sm"
              >
                <Building2 className="mr-1 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Clinic </span>Info
              </TabsTrigger>
              <TabsTrigger
                value="rooms"
                className="rounded-lg data-[state=active]:neu-button data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-shrink-0 text-xs md:text-sm"
              >
                <DoorOpen className="mr-1 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
                Rooms
              </TabsTrigger>
              <TabsTrigger
                value="hours"
                className="rounded-lg data-[state=active]:neu-button data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-shrink-0 text-xs md:text-sm"
              >
                <Clock className="mr-1 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
                Hours
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="rounded-lg data-[state=active]:neu-button data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-shrink-0 text-xs md:text-sm"
              >
                <Bell className="mr-1 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Notif</span>
                <span className="sm:hidden">Alerts</span>
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="rounded-lg data-[state=active]:neu-button data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-shrink-0 text-xs md:text-sm"
              >
                <Shield className="mr-1 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
                Security
              </TabsTrigger>
            </TabsList>

            {/* Clinic Info Tab */}
            <TabsContent value="clinic">
              <div className="rounded-2xl bg-background p-4 md:p-6 neu-card">
                <h2 className="text-lg font-semibold text-foreground mb-4 md:mb-6">Clinic Information</h2>
                <div className="grid gap-4 md:gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Clinic Name</Label>
                    <Input
                      value={clinicInfo.name}
                      onChange={(e) => setClinicInfo({ ...clinicInfo, name: e.target.value })}
                      className="neu-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      value={clinicInfo.phone}
                      onChange={(e) => setClinicInfo({ ...clinicInfo, phone: e.target.value })}
                      className="neu-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input
                      value={clinicInfo.email}
                      onChange={(e) => setClinicInfo({ ...clinicInfo, email: e.target.value })}
                      className="neu-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Website</Label>
                    <Input
                      value={clinicInfo.website}
                      onChange={(e) => setClinicInfo({ ...clinicInfo, website: e.target.value })}
                      className="neu-input"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Address</Label>
                    <Textarea
                      value={clinicInfo.address}
                      onChange={(e) => setClinicInfo({ ...clinicInfo, address: e.target.value })}
                      className="neu-input"
                    />
                  </div>
                </div>
                <div className="mt-4 md:mt-6 flex justify-end">
                  <Button className="w-full sm:w-auto rounded-xl neu-button bg-primary text-primary-foreground">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Rooms & Chairs Tab */}
            <TabsContent value="rooms">
              <div className="rounded-2xl bg-background p-4 md:p-6 neu-card">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 md:mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Dental Rooms & Chairs</h2>
                    <p className="text-sm text-muted-foreground">Manage treatment rooms and dental chairs</p>
                  </div>
                  <Button className="w-full sm:w-auto rounded-xl neu-button bg-primary text-primary-foreground">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Room
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {dentalRooms.map((room) => (
                    <div key={room.id} className="rounded-xl p-4 neu-card">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                              room.status === "available"
                                ? "bg-green-100 text-green-600"
                                : room.status === "occupied"
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-red-100 text-red-600"
                            }`}
                          >
                            <DoorOpen className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{room.name}</h3>
                            <p className="text-sm text-muted-foreground">Chair #{room.chairNumber}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 neu-button">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 neu-button">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Floor: {room.floor}</p>
                        <div className="flex flex-wrap gap-1">
                          {room.equipment.slice(0, 2).map((eq, idx) => (
                            <span key={idx} className="text-xs bg-muted px-2 py-1 rounded-full">
                              {eq}
                            </span>
                          ))}
                          {room.equipment.length > 2 && (
                            <span className="text-xs bg-muted px-2 py-1 rounded-full">
                              +{room.equipment.length - 2} more
                            </span>
                          )}
                        </div>
                        <div className="pt-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              room.status === "available"
                                ? "bg-green-100 text-green-700"
                                : room.status === "occupied"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Working Hours Tab */}
            <TabsContent value="hours">
              <div className="rounded-2xl bg-background p-4 md:p-6 neu-card">
                <h2 className="text-lg font-semibold text-foreground mb-4 md:mb-6">Working Hours</h2>
                <div className="space-y-3 md:space-y-4">
                  {Object.entries(workingHours).map(([day, hours]) => (
                    <div
                      key={day}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 md:p-4 rounded-xl bg-muted/30"
                    >
                      <div className="w-full sm:w-28 flex items-center justify-between sm:justify-start">
                        <span className="font-medium text-foreground capitalize">{day}</span>
                        <Switch
                          className="sm:hidden"
                          checked={hours.enabled}
                          onCheckedChange={(checked) =>
                            setWorkingHours({ ...workingHours, [day]: { ...hours, enabled: checked } })
                          }
                        />
                      </div>
                      <Switch
                        className="hidden sm:flex"
                        checked={hours.enabled}
                        onCheckedChange={(checked) =>
                          setWorkingHours({ ...workingHours, [day]: { ...hours, enabled: checked } })
                        }
                      />
                      {hours.enabled ? (
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <Input
                            type="time"
                            value={hours.open}
                            onChange={(e) =>
                              setWorkingHours({ ...workingHours, [day]: { ...hours, open: e.target.value } })
                            }
                            className="flex-1 sm:w-32 neu-input"
                          />
                          <span className="text-muted-foreground">to</span>
                          <Input
                            type="time"
                            value={hours.close}
                            onChange={(e) =>
                              setWorkingHours({ ...workingHours, [day]: { ...hours, close: e.target.value } })
                            }
                            className="flex-1 sm:w-32 neu-input"
                          />
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Closed</span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 md:mt-6 flex justify-end">
                  <Button className="w-full sm:w-auto rounded-xl neu-button bg-primary text-primary-foreground">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <div className="rounded-2xl bg-background p-4 md:p-6 neu-card">
                <h2 className="text-lg font-semibold text-foreground mb-4 md:mb-6">Notification Settings</h2>
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between p-3 md:p-4 rounded-xl bg-muted/30">
                    <div className="flex-1 pr-4">
                      <p className="font-medium text-foreground text-sm md:text-base">Appointment Reminders</p>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        Send reminders to patients before appointments
                      </p>
                    </div>
                    <Switch
                      checked={notifications.appointmentReminder}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, appointmentReminder: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 md:p-4 rounded-xl bg-muted/30">
                    <div className="flex-1 pr-4">
                      <p className="font-medium text-foreground text-sm md:text-base">Appointment Confirmations</p>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        Send confirmation when appointments are booked
                      </p>
                    </div>
                    <Switch
                      checked={notifications.appointmentConfirmation}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, appointmentConfirmation: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 md:p-4 rounded-xl bg-muted/30">
                    <div className="flex-1 pr-4">
                      <p className="font-medium text-foreground text-sm md:text-base">Low Stock Alerts</p>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        Notify when inventory items are running low
                      </p>
                    </div>
                    <Switch
                      checked={notifications.lowStock}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, lowStock: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 md:p-4 rounded-xl bg-muted/30">
                    <div className="flex-1 pr-4">
                      <p className="font-medium text-foreground text-sm md:text-base">Payment Reminders</p>
                      <p className="text-xs md:text-sm text-muted-foreground">Send reminders for pending payments</p>
                    </div>
                    <Switch
                      checked={notifications.paymentReminder}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, paymentReminder: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 md:p-4 rounded-xl bg-muted/30">
                    <div className="flex-1 pr-4">
                      <p className="font-medium text-foreground text-sm md:text-base">Staff Absence Alerts</p>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        Notify managers when staff mark absence
                      </p>
                    </div>
                    <Switch
                      checked={notifications.staffAbsence}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, staffAbsence: checked })}
                    />
                  </div>
                </div>
                <div className="mt-4 md:mt-6 flex justify-end">
                  <Button className="w-full sm:w-auto rounded-xl neu-button bg-primary text-primary-foreground">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <div className="rounded-2xl bg-background p-4 md:p-6 neu-card">
                <h2 className="text-lg font-semibold text-foreground mb-4 md:mb-6">Security Settings</h2>
                <div className="space-y-4 md:space-y-6">
                  <div className="space-y-2">
                    <Label>Current Password</Label>
                    <Input
                      type="password"
                      placeholder="Enter current password"
                      className="neu-input w-full md:max-w-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input type="password" placeholder="Enter new password" className="neu-input w-full md:max-w-md" />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm New Password</Label>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      className="neu-input w-full md:max-w-md"
                    />
                  </div>
                  <div className="pt-4 border-t border-border">
                    <h3 className="font-medium text-foreground mb-4">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between p-3 md:p-4 rounded-xl bg-muted/30 w-full md:max-w-md">
                      <div className="flex-1 pr-4">
                        <p className="font-medium text-foreground text-sm md:text-base">Enable 2FA</p>
                        <p className="text-xs md:text-sm text-muted-foreground">Add extra security to your account</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-6 flex justify-end">
                  <Button className="w-full sm:w-auto rounded-xl neu-button bg-primary text-primary-foreground">
                    <Save className="mr-2 h-4 w-4" />
                    Update Password
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
