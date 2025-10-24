"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Switch } from "../../../components/ui/switch"
import { Textarea } from "../../../components/ui/textarea"
import { hybridApi } from "../../../src/mocks/hybrid-api"
import { jsonBinService } from "../../../src/services/jsonbin"
import { toast } from "sonner"
import { RefreshCw, Upload, Download, Database, Server, HardDrive } from "lucide-react"

interface ServiceStatus {
  jsonBinEnabled: boolean
  connected: boolean
  lastSync: Date | null
  cacheValid: boolean
}

export default function JSONBinAdminPage() {
  const [status, setStatus] = useState<ServiceStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [localData, setLocalData] = useState<any>(null)
  const [remoteData, setRemoteData] = useState<any>(null)
  const [binId, setBinId] = useState("")
  const [secretKey, setSecretKey] = useState("")
  const [enabled, setEnabled] = useState(false)

  const loadStatus = async () => {
    try {
      const serviceStatus = await hybridApi.getServiceStatus()
      setStatus(serviceStatus)
      
      // Load config from env
      setBinId(process.env.NEXT_PUBLIC_JSONBIN_BIN_ID || "")
      setEnabled(process.env.NEXT_PUBLIC_USE_JSONBIN === 'true')
      
    } catch (error: any) {
      toast.error(`Error loading status: ${error.message}`)
    }
  }

  const loadLocalData = () => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('talentbridge_data')
        setLocalData(stored ? JSON.parse(stored) : null)
      } catch (error) {
        toast.error("Error loading local data")
      }
    }
  }

  const loadRemoteData = async () => {
    setIsLoading(true)
    try {
      const data = await jsonBinService.fetchData()
      setRemoteData(data)
      toast.success("Remote data loaded")
    } catch (error: any) {
      toast.error(`Error loading remote data: ${error.message}`)
      setRemoteData(null)
    } finally {
      setIsLoading(false)
    }
  }

  const migrate = async () => {
    setIsLoading(true)
    try {
      const success = await hybridApi.migrateToJSONBin()
      if (success) {
        toast.success("Migration completed successfully")
        await loadStatus()
        await loadRemoteData()
      } else {
        toast.error("Migration failed")
      }
    } catch (error: any) {
      toast.error(`Migration error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const forceSync = async () => {
    setIsLoading(true)
    try {
      const success = await hybridApi.forceSync()
      if (success) {
        toast.success("Sync completed")
        await loadStatus()
        loadLocalData()
        await loadRemoteData()
      } else {
        toast.error("Sync failed")
      }
    } catch (error: any) {
      toast.error(`Sync error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testConnection = async () => {
    setIsLoading(true)
    try {
      await jsonBinService.fetchData()
      toast.success("Connection successful!")
      await loadStatus()
    } catch (error: any) {
      toast.error(`Connection failed: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleJSONBin = () => {
    hybridApi.setJSONBinEnabled(!enabled)
    setEnabled(!enabled)
    toast.success(`JSONBin ${!enabled ? 'enabled' : 'disabled'}`)
  }

  useEffect(() => {
    loadStatus()
    loadLocalData()
  }, [])

  const getDataSummary = (data: any) => {
    if (!data) return "No data"
    return `${data.users?.length || 0} users, ${data.practices?.length || 0} practices, ${data.applications?.length || 0} applications`
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">JSONBin Administration</h1>
        <div className="flex gap-2">
          <Button onClick={loadStatus} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">JSONBin Status</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge variant={status?.jsonBinEnabled ? "default" : "secondary"}>
                {status?.jsonBinEnabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {status?.connected ? "Connected" : "Not connected"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connection</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge variant={status?.connected ? "default" : "destructive"}>
                {status?.connected ? "Online" : "Offline"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Last sync: {status?.lastSync ? status.lastSync.toLocaleString() : "Never"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Local Cache</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge variant={status?.cacheValid ? "default" : "secondary"}>
                {status?.cacheValid ? "Valid" : "Expired"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {getDataSummary(localData)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="jsonbin-enabled"
              checked={enabled}
              onCheckedChange={toggleJSONBin}
            />
            <Label htmlFor="jsonbin-enabled">Enable JSONBin</Label>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="bin-id">Bin ID</Label>
              <Input
                id="bin-id"
                value={binId}
                onChange={(e) => setBinId(e.target.value)}
                placeholder="Enter your JSONBin Bin ID"
              />
            </div>
            <div>
              <Label htmlFor="secret-key">Secret Key</Label>
              <Input
                id="secret-key"
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="Enter your JSONBin Secret Key"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={testConnection} disabled={isLoading}>
              Test Connection
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Button 
                onClick={migrate} 
                disabled={isLoading || !status?.jsonBinEnabled}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Migrate to JSONBin
              </Button>
              <p className="text-sm text-muted-foreground">
                Upload current localStorage data to JSONBin
              </p>
            </div>
            
            <div className="space-y-2">
              <Button 
                onClick={forceSync} 
                disabled={isLoading || !status?.jsonBinEnabled}
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Force Sync
              </Button>
              <p className="text-sm text-muted-foreground">
                Synchronize localStorage and JSONBin data
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Preview */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Local Data
              <Button onClick={loadLocalData} variant="ghost" size="sm">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-2">{getDataSummary(localData)}</p>
            <Textarea
              value={localData ? JSON.stringify(localData, null, 2) : "No local data"}
              readOnly
              className="font-mono text-xs h-64"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Remote Data (JSONBin)
              <Button onClick={loadRemoteData} variant="ghost" size="sm" disabled={isLoading}>
                <Download className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-2">{getDataSummary(remoteData)}</p>
            <Textarea
              value={remoteData ? JSON.stringify(remoteData, null, 2) : "No remote data"}
              readOnly
              className="font-mono text-xs h-64"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}